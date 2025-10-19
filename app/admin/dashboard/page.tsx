"use client";
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FaUserCircle, FaChartBar, FaUsers, FaClipboardList } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const UserManagement = dynamic(() => import('@/components/admin/UserManagement'), { ssr: false });
const OrderManagement = dynamic(() => import('@/components/admin/OrderManagement'), { ssr: false });
const SalesAnalytics = dynamic(() => import('@/components/admin/SalesAnalytics'), { ssr: false });

const tabs = [
  { key: 'users', label: 'User Management', icon: <FaUsers size={16} /> },
  { key: 'orders', label: 'Order Management', icon: <FaClipboardList size={16} /> },
  { key: 'analytics', label: 'Sales Analytics', icon: <FaChartBar size={16} /> },
];

export default function AdminDashboardPage() {
  "use client";
  // ...existing code...
  const [activeTab, setActiveTab] = useState("users");
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-[#FFFFFF] to-[#E9D8FD] font-sans">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 h-16 flex items-center justify-between px-8 shadow-md bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA]"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-white font-medium text-lg hidden md:inline">Padmaisha</span>
          <FaUserCircle size={40} className="text-white bg-purple-600 rounded-full" />
        </div>
      </motion.header>
      {/* Navigation Tabs */}
      <nav className="flex gap-4 px-8 py-4 bg-white shadow-sm border-b">
        {[{ key: "users", label: "User Management" }, { key: "orders", label: "Order Management" }, { key: "analytics", label: "Sales Analytics" }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
              ${activeTab === tab.key
                ? "bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-white scale-105 shadow-lg"
                : "bg-gray-100 text-purple-700 hover:scale-105 hover:bg-purple-50"}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 px-4 md:px-8 py-6"
      >
        {activeTab === "users" && (
          <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <UserManagement />
          </motion.div>
        )}
        {activeTab === "orders" && (
          <motion.div key="orders" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <OrderManagement />
          </motion.div>
        )}
        {activeTab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
            <SalesAnalytics />
          </motion.div>
        )}
      </motion.main>
      {/* Footer */}
      <footer className="h-12 flex items-center justify-center bg-[#F7FAFC] border-t text-gray-500 text-sm">
        © 2025 Admin Dashboard · <a href="#" className="ml-2 underline">Privacy Policy</a> · <a href="#" className="ml-2 underline">Terms of Service</a>
      </footer>
    </div>
  );
}
