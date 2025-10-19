'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ExchangeOrderPage() {
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    reason: '',
    description: ''
  });

  const handleExchangeRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add exchange request logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">
          ← Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Exchange Your Order</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleExchangeRequest} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-1">
                Order ID
              </label>
              <input
                type="text"
                id="orderId"
                value={orderDetails.orderId}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, orderId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Enter your order ID"
                required
              />
            </div>
            
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Exchange
              </label>
              <select
                id="reason"
                value={orderDetails.reason}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                <option value="size">Wrong Size</option>
                <option value="color">Wrong Color</option>
                <option value="damaged">Damaged Product</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Details
              </label>
              <textarea
                id="description"
                value={orderDetails.description}
                onChange={(e) => setOrderDetails(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={4}
                placeholder="Please provide more details about your exchange request"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-600 transition duration-200"
            >
              Submit Exchange Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
