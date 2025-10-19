'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import { Product } from '@/models/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { state, dispatch } = useApp();
  const router = useRouter();
  const { isAdmin } = useAuth();
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const inWishlist = state?.wishlist?.some((item: any) => item.id === product.id);

  // Always use the product.image if available, fallback to a default image
  const productImage = product.image || '/product-images/default.jpg';

  const handleAddToCart = () => {
    if (!product.sizes || product.sizes.length === 0) {
      toast.error('No size available for this product');
      return;
    }
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product: { ...product, originalPrice: product.originalPrice || product.price }, size: product.sizes[0] || 'M', quantity: 1 } 
    });
  try { window?.dispatchEvent(new CustomEvent('padmaisha:cart-updated', { detail: { product, size: product.sizes?.[0] || 'M', quantity: 1 } })); } catch (e) {}
    toast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="h-6 w-6 text-pink-500" />,
      style: {
        borderRadius: '1rem',
        background: '#fff',
        color: '#333',
        fontWeight: 'bold',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)'
      },
    });
  };

  const handleToggleWishlist = () => {
    if (inWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
      toast.success('Removed from wishlist!');
    } else {
  dispatch({ type: 'ADD_TO_WISHLIST', payload: { ...product, originalPrice: product.originalPrice || product.price } });
      toast.success('Added to wishlist!');
    }
  };

  // Admin actions: set position & delete product
  const [editingPosition, setEditingPosition] = React.useState<number | null>(null);
  const savePosition = async () => {
    if (editingPosition === null) return;
    try {
      const docRef = doc(db, 'products', product.id);
      await updateDoc(docRef, { position: Number(editingPosition) });
      toast.success('Position updated');
      // reload to reflect ordering (simple approach)
      window.location.reload();
    } catch (e) {
      toast.error('Failed to update position');
    }
  };

  const handleDeleteProduct = async () => {
    const ok = confirm(`Delete product "${product.name}"? This cannot be undone.`);
    if (!ok) return;
    try {
      await deleteDoc(doc(db, 'products', product.id));
      toast.success('Product deleted');
      window.location.reload();
    } catch (e) {
      toast.error('Failed to delete product');
    }
  };

  return (
  <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full max-w-[320px] flex flex-col min-h-[360px]">
  <Link href={`/products/${encodeURIComponent(product.id)}`}>
  <div className="relative overflow-hidden w-full h-0 pb-[100%]"> {/* 1:1 square */}
          <img
            src={productImage}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300 p-4"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = '/product-images/default.jpg';
            }}
          />
          {discount > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              {discount}% OFF
            </Badge>
          )}
          <button
            className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md transition-opacity ${inWishlist ? 'text-red-500' : 'text-gray-600'} opacity-100`}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={e => {
              e.preventDefault();
              handleToggleWishlist();
            }}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
      </Link>

  <div className="p-4 flex flex-col flex-1 justify-between">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs">
            {product.brand}
          </Badge>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-red-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

          <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-bold text-red-500">Rs. {product.price.toLocaleString()}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">Rs. {product.originalPrice.toLocaleString()}</span>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-sm text-gray-600">Sizes:</span>
          {(product.sizes || []).slice(0, 3).map((size) => (
            <Badge key={size} variant="outline" className="text-xs">
              {size}
            </Badge>
          ))}
          {(product.sizes || []).length > 3 && (
            <span className="text-xs text-gray-500 whitespace-nowrap">+{(product.sizes || []).length - 3} more</span>
          )}
        </div>

                      {product.sizes && product.sizes.length > 0 ? (
                        <Button
                          onClick={() => handleAddToCart()}
                          className="w-full btn-primary ripple"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      ) : (
                        <Button
                          onClick={(e) => { e.preventDefault(); dispatch({ type: 'ADD_TO_CART', payload: { product: product, size: 'M', quantity: 1 } }); toast.success(`${product.name} added to cart!`); }}
                          className="w-full btn-primary ripple"
                          size="sm"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                      )}
                        {isAdmin && (
                          <div className="mt-3 flex gap-2">
                            <input
                              type="number"
                              value={editingPosition ?? product.position ?? ''}
                              onChange={e => setEditingPosition(Number(e.target.value))}
                              placeholder="pos"
                              className="w-20 px-2 py-1 border rounded"
                            />
                            <button onClick={savePosition} className="px-3 py-1 bg-indigo-600 text-white rounded">Save</button>
                            <button onClick={handleDeleteProduct} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                          </div>
                        )}
      </div>
    </div>
  );
};

export default ProductCard;