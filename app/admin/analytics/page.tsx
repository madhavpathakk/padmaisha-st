"use client";
// ...existing code...
import React from "react";
// TODO: Implement useAnalytics hook and AnalyticsCharts component
export default function AnalyticsPage() {
  const { orders } = require("../../../hooks/useRevenue").useRevenue();
  const totalUsers = new Set(orders.map((o: any) => o.user?.id || o.user?.name || o.name)).size;
  const totalItems = orders.reduce((sum: number, o: any) => sum + (Array.isArray(o.items) ? o.items.reduce((s: number, i: any) => s + (i.quantity || 0), 0) : 0), 0);
  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow p-6 flex flex-col items-center animate-fade-in">
          <div className="text-lg font-semibold mb-2">Total Users</div>
          <div className="text-3xl font-bold">{totalUsers}</div>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow p-6 flex flex-col items-center animate-fade-in">
          <div className="text-lg font-semibold mb-2">Total Items Sold</div>
          <div className="text-3xl font-bold">{totalItems}</div>
        </div>
        <div className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-lg shadow p-6 flex flex-col items-center animate-fade-in">
          <div className="text-lg font-semibold mb-2">Total Revenue</div>
          <div className="text-3xl font-bold">₹{totalRevenue.toLocaleString()}</div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4 animate-fade-in">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100 dark:bg-[#23232b]">
              <th className="px-4 py-2">Order ID</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 10).map((order: any, idx: number) => (
              <tr key={order.id ? order.id : `${order.user?.name || order.name || 'order'}-${idx}`} className="border-b">
                <td className="px-4 py-2">{order.id || "-"}</td>
                <td className="px-4 py-2">{order.user?.name || order.name || "-"}</td>
                <td className="px-4 py-2">₹{order.total?.toLocaleString() || "-"}</td>
                <td className="px-4 py-2">{order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
