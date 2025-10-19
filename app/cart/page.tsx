
"use client";
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
// Modular CartItem component
function CartItem({ item, dispatch }: { item: any, dispatch: any }) {
  return (
    <div className="flex items-center bg-white rounded-xl shadow p-4 gap-4 border border-gray-100 hover:border-pink-400 transition-all min-h-[120px]">
      <img
        src={item.image || '/product-images/default.jpg'}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg border shadow"
        onError={(e) => { (e.target as HTMLImageElement).src = '/product-images/default.jpg'; }}
      />
      <div className="flex-1 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900 text-base mb-1 tracking-tight line-clamp-1">{item.name}</h3>
            <p className="text-xs text-gray-500 mb-1 font-medium">{item.brand}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              <span className="px-2 py-1 bg-blue-50 rounded text-xs font-semibold text-blue-700 border">{item.selectedSize}</span>
              <span className="px-2 py-1 bg-pink-50 rounded text-xs font-semibold text-pink-700 border">{item.color}</span>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'REMOVE_FROM_CART', payload: item.id + '-' + item.selectedSize })}
            className="text-gray-400 hover:text-red-500 p-2 rounded-full border border-gray-200 hover:bg-red-50 transition"
            aria-label="Remove"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id + '-' + item.selectedSize, quantity: item.quantity - 1 } })}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-base font-bold"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="font-bold text-base px-1">{item.quantity}</span>
            <button
              onClick={() => dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id: item.id + '-' + item.selectedSize, quantity: item.quantity + 1 } })}
              className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-base font-bold"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className="text-right">
            <div className="font-bold text-base text-indigo-700">₹{(item.price * item.quantity).toLocaleString()}</div>
            {item.originalPrice > item.price && (
              <div className="text-xs text-gray-400 line-through">₹{(item.originalPrice * item.quantity).toLocaleString()}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Modular OrderSummary component
function OrderSummary({ total }: { total: number }) {
    const { user } = useApp();
    const [couponCode, setCouponCode] = useState('');
    const [showCouponInput, setShowCouponInput] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    
    const applyCoupon = (code: string) => {
      if (code.toLowerCase() === 'flat15' && total >= 5000) {
        const discount = total * 0.15;
        setAppliedDiscount(discount);
        toast.success('15% discount applied successfully!');
      } else if (code.toLowerCase() === 'flat20' && total >= 10000) {
        const discount = total * 0.20;
        setAppliedDiscount(discount);
        toast.success('20% discount applied successfully!');
      } else {
        setAppliedDiscount(0);
        if (code) {
          if (total < 5000) {
            toast.error('Shop for ₹5,000 or more to use coupons');
          } else {
            toast.error('Invalid coupon code');
          }
        }
      }
    };

    const finalTotal = total - appliedDiscount;

    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 h-fit flex flex-col gap-6 border border-gray-100">
        <h2 className="text-xl font-extrabold mb-2 text-gray-900 tracking-tight">Order Summary</h2>
        
        {/* Coupon Section */}
        <div className="border-b border-gray-100 pb-4">
          {showCouponInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => applyCoupon(couponCode)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply
                </button>
              </div>
              <div className="text-xs text-gray-500">
                • Use FLAT15 for 15% off on orders above ₹5,000<br />
                • Use FLAT20 for 20% off on orders above ₹10,000
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCouponInput(true)}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Have a coupon code?
            </button>
          )}
        </div>

        {/* Price Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{appliedDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-3">
            <span>Total</span>
            <span className="text-indigo-600">₹{finalTotal.toLocaleString()}</span>
          </div>
        </div>

        {!user && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            Please login to proceed with checkout
          </div>
        )}

        <button
          onClick={() => {
            if (!user) {
              // Store cart state in localStorage before redirecting
              localStorage.setItem('checkout_redirect', '/cart');
              window.location.href = '/login';
              return;
            }
            window.location.href = '/checkout';
          }}
          className={`w-full py-4 text-white rounded-xl font-bold text-lg relative overflow-hidden group transition-all ${
            !user 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
          }`}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {user ? (
              <>
                Proceed to Checkout
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                Login to Checkout
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </span>
        </button>
      </div>
    );
}

function CartPage() {
  const { state, dispatch } = useApp();
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Responsive cart UI
  const cartItems = state.cart || [];
  const isEmpty = cartItems.length === 0;
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 sm:px-4 md:px-8 lg:px-16">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-left tracking-tight">Shopping Cart</h1>
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center h-80">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 flex flex-col items-center gap-4 w-full max-w-sm mx-auto">
            <svg className="w-16 h-16 text-blue-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007.6 17h8.8a1 1 0 00.95-.68L21 13M7 13V6h13" /></svg>
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Your cart is empty</h2>
            <p className="text-gray-500 text-base text-center mb-2">Looks like you haven’t added anything yet. Start shopping to fill your cart with amazing products!</p>
            <a href="/products" className="w-full py-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-lg font-bold text-base shadow hover:bg-gradient-to-l hover:from-indigo-500 hover:to-pink-500 transition-all text-center">Start Shopping</a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Cart Items - left */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow p-4 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-lg font-semibold">{cartItems.length} item(s) in your cart</div>
              </div>
              <div className="space-y-4">
                {cartItems.map((item: any) => (
                  <CartItem key={item.id + '-' + item.selectedSize} item={item} dispatch={dispatch} />
                ))}
              </div>
            </div>
          </div>
          {/* Summary Section - right */}
          <div className="lg:col-span-4">
            <OrderSummary total={total} />
            <div className="mt-4 bg-white p-4 rounded-xl shadow border border-gray-100">
              <h3 className="text-sm font-semibold mb-2">Price Details</h3>
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-gray-600 mt-2"><span>Platform Fee</span><span>₹20</span></div>
              <div className="flex justify-between text-sm text-gray-600 mt-2"><span>Delivery Charges</span><span>₹{total > 2000 ? 0 : 50}</span></div>
              <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>₹{(total + 20 + (total > 2000 ? 0 : 50)).toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;