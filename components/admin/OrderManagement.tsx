import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../lib/firebase';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

type Order = {
  id: string;
  name?: string;
  phone?: string;
  address?: string;
  gst?: string;
  items?: { name: string; brand?: string; category?: string; price?: number; quantity?: number }[];
  status?: string;
  total?: number;
};

// Dummy fallback data for local/dev
const fallbackOrders: Order[] = [
  {
    id: 'ORD123',
    name: 'Madhav Pathak',
    phone: '9876543210',
    address: 'Delhi',
    items: [ { name: 'Shirt' }, { name: 'Jeans' } ],
    status: 'Pending',
  },
  {
    id: 'ORD124',
    name: 'Vansh Jain',
    phone: '9123456789',
    address: 'Mumbai',
    items: [ { name: 'Dress' } ],
    status: 'Shipped',
  },
];

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        if (db) {
          const snapshot = await getDocs(collection(db, "orders"));
          const data: Order[] = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
            const d = doc.data();
            // Format address field for readability
            let address = "-";
            if (typeof d.address === "string") {
              address = d.address;
            } else if (d.address && typeof d.address === "object" && !Array.isArray(d.address)) {
              address = Object.entries(d.address)
                .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                .join(', ');
            } else if (d.user?.address) {
              address = d.user.address;
            }

            // Format GST field
            let gst = "-";
            if (typeof d.gst === "string") {
              gst = d.gst;
            } else if (d.gst && typeof d.gst === "object" && !Array.isArray(d.gst)) {
              gst = Object.entries(d.gst)
                .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                .join(', ');
            } else if (d.user?.gst) {
              gst = d.user.gst;
            }

            // Format status field
            let status = "-";
            if (typeof d.status === "string") {
              status = d.status;
            } else if (d.status && typeof d.status === "object" && !Array.isArray(d.status)) {
              status = Object.entries(d.status)
                .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
                .join(', ');
            }

            return {
              id: doc.id,
              name: d.name || d.user?.name || "-",
              phone: d.phone || d.user?.phone || "-",
              address,
              gst,
              items: Array.isArray(d.items) ? d.items.map(item => ({
                name: item.name,
                brand: item.brand,
                category: item.category,
                price: item.price,
                quantity: item.quantity
              })) : [],
              status,
              total: d.total || 0,
            };
          });
          setOrders(data);
        } else {
          setOrders(fallbackOrders);
        }
      } catch (err) {
    setError("Failed to load orders" as any);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o =>
    (o.name && o.name.toLowerCase().includes(search.toLowerCase())) ||
    (o.phone && o.phone.toLowerCase().includes(search.toLowerCase())) ||
    (o.address && o.address.toLowerCase().includes(search.toLowerCase())) ||
    (o.gst && o.gst.toLowerCase().includes(search.toLowerCase())) ||
    (o.status && o.status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg p-8 mb-8"
    >
      <h2 className="text-xl font-bold text-[#6B46C1] mb-4">Order Management</h2>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search orders..."
        className="mb-6 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 w-full text-sm"
      />
      {loading ? (
        <div className="animate-pulse text-gray-400">Loading orders...</div>
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-gray-500">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-[#F7FAFC]">
                <th className="px-4 py-2 font-medium text-gray-700">Order ID</th>
                <th className="px-4 py-2 font-medium text-gray-700">User Name</th>
                <th className="px-4 py-2 font-medium text-gray-700">Phone</th>
                <th className="px-4 py-2 font-medium text-gray-700">Address</th>
                <th className="px-4 py-2 font-medium text-gray-700">GST No.</th>
                <th className="px-4 py-2 font-medium text-gray-700">Items</th>
                <th className="px-4 py-2 font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 font-medium text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className={
                    idx % 2 === 0
                      ? "bg-white hover:bg-[#EDF2F7] transition"
                      : "bg-[#F7FAFC] hover:bg-[#EDF2F7] transition"
                  }
                  style={{ borderRadius: "8px" }}
                >
                  <td className="px-4 py-2 text-gray-800 font-medium">{order.id}</td>
                  <td className="px-4 py-2 text-gray-800">{order.name || "-"}</td>
                  <td className="px-4 py-2 text-gray-800">{order.phone || "-"}</td>
                  <td className="px-4 py-2 text-gray-800 whitespace-pre-line">
                    {order.address && order.address !== "-" ? (
                      <div className="leading-tight">
                        {/* Only show address string, not IsDefault, GST, Phone, Name */}
                        {(() => {
                          // Try to extract only the address value
                          const addressParts = order.address.split(',').filter(part => {
                            const label = part.split(':')[0]?.trim().toLowerCase();
                            return label === 'address';
                          });
                          if (addressParts.length > 0) {
                            return addressParts.map((part, i) => {
                              const value = part.split(':')[1];
                              return <div key={i}>{value ? value.trim() : '-'}</div>;
                            });
                          }
                          // If not found, fallback to full string
                          return <div>{order.address}</div>;
                        })()}
                      </div>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {order.gst && order.gst !== "-" ? (
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">{order.gst}</span>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {Array.isArray(order.items) && order.items.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="mb-1">
                            <span className="font-semibold">{item.name}</span>
                            {item.brand && <span className="ml-1 text-xs text-gray-500">({item.brand})</span>}
                            {item.category && <span className="ml-1 text-xs text-gray-500">[{item.category}]</span>}
                            {typeof item.price === "number" && <span className="ml-2 text-green-700">₹{item.price}</span>}
                            {item.quantity && <span className="ml-2 text-purple-700">x{item.quantity}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-800">
                    {order.status && order.status !== "-" ? (
                      <div className="flex flex-col gap-1">
                        {order.status.split(',').map((part, i) => {
                          const [label, value] = part.split(':');
                          if (!label || value === undefined) return null;
                          // Only show relevant status fields
                          const allowed = [
                            'fulfilled',
                            'order_placed',
                            'replaced',
                            'returned',
                            'notes',
                            'contacted'
                          ];
                          const labelClean = label.trim().toLowerCase();
                          if (!allowed.includes(labelClean)) return null;
                          const val = value.trim().toLowerCase();
                          if (["true", "false"].includes(val)) {
                            return (
                              <span key={i} className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${val === "true" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                                {label.charAt(0).toUpperCase() + label.slice(1)}: {val === "true" ? "Yes" : "No"}
                              </span>
                            );
                          }
                          return (
                            <span key={i} className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {label.charAt(0).toUpperCase() + label.slice(1)}: {value.trim()}
                            </span>
                          );
                        })}
                      </div>
                    ) : "-"}
                  </td>
                  <td className="px-4 py-2 text-gray-800 font-semibold">₹{order.total?.toLocaleString() || "-"}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default OrderManagement;
