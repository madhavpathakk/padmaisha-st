'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add order tracking logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your order ID"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-600 transition duration-200"
            >
              Track Order
            </button>
          </form>
          
          {orderDetails && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              {/* Order details will be displayed here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
