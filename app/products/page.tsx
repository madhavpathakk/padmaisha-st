'use client';
import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useAuth } from '@/contexts/AuthContext';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';
import { Product } from '@/models/product';

// Admin UI: duplicate preview + delete
function AdminDuplicateRemoval() {
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const load = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
  const map = new Map<string, any[]>();
    snapshot.docs.forEach(d => {
      const data = d.data();
      const key = ((data.name||'') + '|' + (data.brand||'')).toLowerCase();
      if (!map.has(key)) map.set(key, []);
      const arr = map.get(key) || [];
      arr.push({ id: d.id, ...data });
      map.set(key, arr);
    });
  const dupGroups = Array.from(map.values()).filter(arr => arr.length > 1);
    setGroups(dupGroups);
  };
  return (
    <div>
      <Button variant="ghost" onClick={async () => { setOpen(true); await load(); }}>Find Duplicates</Button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-4xl max-h-[80vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Duplicate products (preview)</h3>
            {groups.length === 0 ? (
              <p>No duplicates found.</p>
            ) : groups.map((g, i) => (
              <div key={i} className="mb-4 border p-3 rounded">
                <div className="font-semibold mb-2">Group {i+1} - {g[0].name} ({g.length})</div>
                <div className="space-y-2">
                  {g.map((item:any) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={item.image || '/brands/logo.png'} className="w-12 h-12 object-cover rounded" />
                        <div>
                          <div className="font-medium">{item.brand}</div>
                          <div className="text-xs text-gray-500">ID: {item.id}</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={async () => { await deleteDoc(doc(db,'products',item.id)); toast.success('Deleted'); await load(); }} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ProductsPage = () => {
  const { state } = useApp();
  const { isAdmin } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  // Default to manual ordering so admin-set `position` keeps products stable
  const [sortBy, setSortBy] = useState('manual');
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brands: [] as string[],
    colors: [] as string[],
    priceRange: { min: 0, max: 10000 },
    sizes: [] as string[],
    discount: [] as string[]
  });

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    // Defensive: ensure we have an array
    const productsArr: Product[] = Array.isArray(state?.products) ? state.products : [];
    // Start with a stable copy
    let filtered = [...productsArr];

    // Remove duplicate products by id (keep first occurrence) to avoid duplicate renders
    const seen = new Set<string>();
    filtered = filtered.filter((p: Product) => {
      if (!p?.id) return false;
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p: Product) => filters.categories.includes(p.category || ''));
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((p: Product) => filters.brands.includes(p.brand || ''));
    }
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p: Product) => filters.colors.includes(p.color || ''));
    }
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p: Product) => (p.sizes || []).some(size => filters.sizes.includes(size)));
    }
    filtered = filtered.filter((p: Product) => 
      (p.price || 0) >= filters.priceRange.min && (p.price || 0) <= filters.priceRange.max
    );

    // If products have an explicit `position` field (manual ordering set by admin), prefer it
    const hasManualPositions = filtered.some((p: Product) => typeof p.position === 'number');
    if (sortBy === 'manual' || hasManualPositions) {
      filtered.sort((a: Product, b: Product) => {
        const pa = typeof a.position === 'number' ? a.position! : Number.MAX_SAFE_INTEGER;
        const pb = typeof b.position === 'number' ? b.position! : Number.MAX_SAFE_INTEGER;
        if (pa !== pb) return pa - pb;
        // fallback to newest
        const aTime = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.seconds || 0);
        const bTime = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.seconds || 0);
        return bTime - aTime;
      });
    } else {
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          filtered.sort((a: Product, b: Product) => {
            const aTime = typeof a.createdAt === 'number' ? a.createdAt : (a.createdAt?.seconds || 0);
            const bTime = typeof b.createdAt === 'number' ? b.createdAt : (b.createdAt?.seconds || 0);
            return bTime - aTime;
          });
          break;
        case 'price-low':
          filtered.sort((a: Product, b: Product) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          filtered.sort((a: Product, b: Product) => (b.price || 0) - (a.price || 0));
          break;
        case 'name':
          filtered.sort((a: Product, b: Product) => (a.name || '').localeCompare(b.name || ''));
          break;
        default:
          // popularity - keep current order
          break;
      }
    }

    return filtered;
  }, [state.products, filters, sortBy]);
  const productsArr = Array.isArray(state?.products) ? state.products : [];
  const categories = Array.from(new Set(productsArr.map(p => p.category).filter(Boolean)));
  const brands = Array.from(new Set(productsArr.map(p => p.brand).filter(Boolean)));
  const colors = Array.from(new Set(productsArr.map(p => p.color).filter(Boolean)));
  const sizes = Array.from(new Set(productsArr.flatMap(p => p.sizes || []).filter(Boolean)));

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [type]: checked 
        ? [...(prev[type as keyof typeof prev] as string[]), value]
        : (prev[type as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      categories: [],
      brands: [],
      colors: [],
      priceRange: { min: 0, max: 10000 },
      sizes: [],
      discount: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm w-full">
        <div className="w-full px-2 sm:px-4 md:px-8 py-8">
          <div className="text-center w-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Products</h1>
            <p className="text-xl text-gray-600">Discover our complete collection of premium B2B fashion</p>
          </div>
        </div>
      </div>

      <div className="w-full px-2 sm:px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-80 bg-white rounded-lg shadow-sm p-6 h-fit`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                CLEAR ALL
              </Button>
            </div>

            {/* Categories Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Categories</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-3">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={filters.categories.includes(category || '')}
                      onCheckedChange={(checked) => 
                        handleFilterChange('categories', category || '', checked as boolean)
                      }
                    />
                    <label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Brands Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Brands</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-3">
                {brands.map(brand => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={brand}
                      checked={filters.brands.includes(brand || '')}
                      onCheckedChange={(checked) => 
                        handleFilterChange('brands', brand || '', checked as boolean)
                      }
                    />
                    <label htmlFor={brand} className="text-sm cursor-pointer">
                      {brand}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Colors Filter */}
            <Collapsible defaultOpen>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Colors</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-3">
                {colors.map(color => (
                  <div key={color} className="flex items-center space-x-2">
                    <Checkbox
                      id={color}
                      checked={filters.colors.includes(color || '')}
                      onCheckedChange={(checked) => 
                        handleFilterChange('colors', color || '', checked as boolean)
                      }
                    />
                    <label htmlFor={color} className="text-sm cursor-pointer">
                      {color}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>

            {/* Sizes Filter */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full py-3 border-b">
                <span className="font-medium">Sizes</span>
                <ChevronDown className="h-4 w-4" />
              </CollapsibleTrigger>
              <CollapsibleContent className="py-3 space-y-3">
                {sizes.map(size => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox
                      id={size}
                      checked={filters.sizes.includes(size)}
                      onCheckedChange={(checked) => 
                        handleFilterChange('sizes', size, checked as boolean)
                      }
                    />
                    <label htmlFor={size} className="text-sm cursor-pointer">
                      {size}
                    </label>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Filter Bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                {/* Admin dedupe action */}
                {/* show dedupe only for admins */}
                {isAdmin && (
                  <AdminDuplicateRemoval />
                )}
                <span className="text-gray-600">
                  Showing {filteredAndSortedProducts.length} of {state.products.length} products
                </span>
              </div>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="manual">Manual (admin)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 px-1">
                {filteredAndSortedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <Button onClick={clearAllFilters} className="mt-4">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;