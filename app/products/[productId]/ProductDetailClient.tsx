"use client";
// ...existing code...
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Modal } from '../../../components/ui/modal';
import { ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';
import FeaturedProducts from '@/components/FeaturedProducts';

const ProductDetailClient = () => {
  const params = useParams();
  const router = useRouter();
  const [showShareModal, setShowShareModal] = useState(false);
  const { state, dispatch } = useApp();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showDefaultSizePrompt, setShowDefaultSizePrompt] = useState(false);
  const [productsReady, setProductsReady] = useState(false);

  useEffect(() => {
    if (state.products && state.products.length > 0) {
      setProductsReady(true);
    }
  }, [state.products]);

  const productId = params?.productId as string;
  const product = state.products.find(p => p.id === productId);

  if (!productsReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-lg text-gray-500 animate-pulse">Loading...</span>
      </div>
    );
  }

  // Images array must be defined before fallbackProduct
  const actualImages = [
    '/product-images/WhatsApp Image 2025-09-16 at 15.32.58.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.34.39.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.35.34.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.36.15.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.37.01.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 15.38.55.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.37.02.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.47.23.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.52.53.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 18.58.50.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.03.07.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.07.53.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.15.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.20.48.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.24.52.jpeg',
    '/product-images/WhatsApp Image 2025-09-16 at 19.29.04.jpeg',
    '/product-images/WhatsApp Image 2025-09-25 at 18.31.21.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 10.48.12.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.00.28.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.05.27.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.12.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.15.54.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.18.29.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.24.05.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.26.23.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.36.51.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.40.45.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 11.44.20.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.10.45.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.20.16.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.25.52.jpeg',
    '/product-images/WhatsApp Image 2025-09-26 at 12.27.49.jpeg',
  ];
  // Fallback demo product if not found
  const fallbackProduct = {
    id: 'demo-product',
    name: 'Demo Fashion Product',
    price: 1299,
    originalPrice: 1899,
    image: actualImages[Math.floor(Math.random() * actualImages.length)],
    brand: 'Padmaisha',
    category: 'Kurtis',
    color: 'Red',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A premium demo product for retailers. Stylish, comfortable, and made from high-quality materials. Perfect for showcasing your store.',
    season: 'All Seasons',
  };
  // Always use the product from state if found, fallback only if not found
  const showProduct = product ? { ...product } : fallbackProduct;

  const discount = showProduct.originalPrice ? Math.round(((showProduct.originalPrice - showProduct.price) / showProduct.originalPrice) * 100) : 0;
  const relatedProducts = state.products
    .filter(p => p.brand === showProduct.brand && p.id !== showProduct.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    // If product has sizes and none selected, show small prompt to add default size
    if (showProduct.sizes && showProduct.sizes.length > 0 && !selectedSize) {
      setShowDefaultSizePrompt(true);
      return;
    }

    const sizeToUse = selectedSize || (showProduct.sizes && showProduct.sizes.length > 0 ? showProduct.sizes[0] : 'M');
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product: showProduct,
        size: sizeToUse,
        quantity: quantity,
      },
    });
    // emit global event so Navbar can show mini-cart flyout
    try { window?.dispatchEvent(new CustomEvent('padmaisha:cart-updated', { detail: { product: showProduct, size: sizeToUse, quantity } })); } catch (e) {}
    toast.success(`${showProduct.name} (${quantity}) added to cart!`);
    setTimeout(() => router.push('/cart'), 500);
  };

  const inWishlist = state?.wishlist?.some((item) => item.id === showProduct.id);
  const handleToggleWishlist = () => {
    if (inWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: showProduct.id });
      toast.success('Removed from wishlist!');
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: showProduct });
      toast.success('Added to wishlist!');
      setTimeout(() => router.push('/profile/wishlist'), 500);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      setShowShareModal(true);
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12 bg-white rounded-lg shadow-sm p-8">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <Image
                src={showProduct.image || '/product-images/default.jpg'}
                alt={showProduct.name}
                width={800}
                height={600}
                className="w-full h-96 lg:h-[600px] object-cover hover:scale-105 transition-transform duration-300 cursor-zoom-in"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=800&fit=crop';
                }}
                priority
                unoptimized
              />
              {discount > 0 && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white text-lg px-3 py-2">
                  {discount}% OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {showProduct.brand}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{showProduct.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-red-500">₹{showProduct.price.toLocaleString()}</span>
                {showProduct.originalPrice && showProduct.originalPrice > showProduct.price && (
                  <>
                    <span className="text-xl text-gray-500 line-through">₹{showProduct.originalPrice.toLocaleString()}</span>
                    <Badge className="bg-green-100 text-green-800">
                      Save ₹{(showProduct.originalPrice ? (showProduct.originalPrice - showProduct.price) : 0).toLocaleString()}
                    </Badge>
                  </>
                )}
              </div>
              {state.user?.isRegistered && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-green-800 font-medium">
                    🎉 Extra 12% discount applied for registered retailers!
                  </p>
                  <p className="text-green-600 text-sm">
                    Final price: ₹{Math.round(showProduct.price * 0.88).toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {(showProduct.sizes || []).map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <Select value={quantity.toString()} onValueChange={(value) => setQuantity(parseInt(value))}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,10,20,50].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={handleAddToCart}
                className="w-full btn-primary text-white py-3 text-lg ripple"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={inWishlist ? "default" : "outline"}
                  size="lg"
                  onClick={handleToggleWishlist}
                  className={inWishlist ? "bg-red-500 text-white" : ""}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </Button>
                <Button variant="outline" size="lg" onClick={handleShare}>
                  <Share2 className="h-5 w-5 mr-2" />
                  Share
                </Button>
              </div>
              {/* Default size prompt */}
              {showDefaultSizePrompt && (
                <div className="mt-3 bg-yellow-50 border border-yellow-200 p-3 rounded">
                  <p className="text-yellow-800">You haven't selected a size. Add default size <strong>{showProduct?.sizes?.[0] || 'M'}</strong>?</p>
                  <div className="mt-2 flex gap-2">
                    <Button onClick={() => { setSelectedSize(showProduct?.sizes?.[0] || 'M'); setShowDefaultSizePrompt(false); handleAddToCart(); }}>Add default size</Button>
                    <Button variant="outline" onClick={() => setShowDefaultSizePrompt(false)}>Choose size</Button>
                  </div>
                </div>
              )}
              {/* Share Modal */}
              {showShareModal && (
                <Modal open={showShareModal} onClose={() => setShowShareModal(false)}>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-4">Share Product</h2>
                    <p className="mb-2">Share this link with others:</p>
                    <Input value={window.location.href} readOnly className="mb-4" id="share-link-input" />
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          toast.success('Link copied to clipboard!');
                        }}
                      >
                        Copy Link
                      </Button>
                      <Button onClick={() => setShowShareModal(false)}>
                        Close
                      </Button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 py-6 border-t">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600">Free shipping on orders above ₹2000</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600">30-day return policy</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600">Quality guaranteed</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{showProduct.description}</p>
                
                <div className="mt-4 space-y-2">
                  <p className="text-sm"><span className="font-medium">Category:</span> {showProduct.category}</p>
                  <p className="text-sm"><span className="font-medium">Color:</span> {showProduct.color}</p>
                  <p className="text-sm"><span className="font-medium">Season:</span> {showProduct.season}</p>
                   <p className="text-sm"><span className="font-medium">Available Sizes:</span> {(showProduct.sizes || []).join(', ')}</p>
                </div>
            </div>
          </div>
        </div>

  {/* Featured Collection - all products */}
  <FeaturedProducts />
      </div>
    </div>
  );
};

export default ProductDetailClient;
