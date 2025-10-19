"use client";
import React from "react";
import AddProduct from "../../../components/AddProduct";
import ManageProducts from "../../../components/ManageProducts";

export default function AuditPage() {
  const [tab, setTab] = React.useState("add");
  return (
    <div className="p-8 bg-[#23232b] min-h-screen">
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-full font-semibold shadow transition text-white ${tab === 'add' ? 'bg-purple-600' : 'bg-[#18181b] border border-gray-700'}`}
          onClick={() => setTab('add')}
        >Add Product</button>
        <button
          className={`px-6 py-2 rounded-full font-semibold shadow transition text-white ${tab === 'manage' ? 'bg-purple-600' : 'bg-[#18181b] border border-gray-700'}`}
          onClick={() => setTab('manage')}
        >Manage Products</button>
      </div>
      {tab === 'add' ? <AddProduct /> : <ManageProducts />}
    </div>
  );
}
