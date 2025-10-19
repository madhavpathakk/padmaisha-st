'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SortAsc, SortDesc, Eye, Package, Truck, Check, X, AlertCircle } from 'lucide-react';
import Pagination from './Pagination';

interface OrderDetails {
  id: string;
  user: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    gst?: string;
  };
  items: Array<{
    name: string;
    size?: string;
    color?: string;
    quantity: number;
    price: number;
    originalPrice?: number;
    discount?: number;
    image?: string;
  }>;
  total: number;
  subtotal: number;
  platformFee: number;
  deliveryCharges: number;
  status: string;
  createdAt: any;
  orderDate: string;
}

export default function OrderTable({ orders, loading, error }: { orders: OrderDetails[]; loading: boolean; error?: string }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState<'asc'|'desc'>("desc");
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const pageSize = 10;

  const filtered = useMemo(() => orders.filter(order => 
    order.user.name?.toLowerCase().includes(search.toLowerCase()) ||
    order.user.phone?.includes(search) ||
    order.id?.toLowerCase().includes(search.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
  ), [orders, search]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = a[sortBy as keyof OrderDetails];
      let bVal = b[sortBy as keyof OrderDetails];
      if (sortBy === "createdAt" && aVal?.seconds && bVal?.seconds) {
        aVal = aVal.seconds;
        bVal = bVal.seconds;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
    });
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const OrderDetails = ({ order }: { order: OrderDetails }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={() => setSelectedOrder(null)}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
          <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        {/* Order Status */}
        <div className="mb-6">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
            order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            <Package className="w-4 h-4 mr-2" />
            {order.status}
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Customer Information</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><span className="font-medium">Name:</span> {order.user.name}</p>
              <p><span className="font-medium">Phone:</span> {order.user.phone}</p>
              {order.user.email && <p><span className="font-medium">Email:</span> {order.user.email}</p>}
              <p><span className="font-medium">Address:</span> {order.user.address}</p>
              {order.user.gst && <p><span className="font-medium">GST:</span> {order.user.gst}</p>}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Order Summary</h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleString()}</p>
              <p><span className="font-medium">Subtotal:</span> ₹{order.subtotal.toLocaleString()}</p>
              <p><span className="font-medium">Platform Fee:</span> ₹{order.platformFee.toLocaleString()}</p>
              <p><span className="font-medium">Delivery Charges:</span> ₹{order.deliveryCharges.toLocaleString()}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Total: ₹{order.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-md overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image || '/product-images/default.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = '/product-images/default.jpg';
                      target.className = 'w-full h-full object-contain opacity-50';
                    }}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.name}</h4>
                  <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {item.size && <span className="mr-4">Size: {item.size}</span>}
                    {item.color && <span className="mr-4">Color: {item.color}</span>}
                    <span>Quantity: {item.quantity}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                    {item.originalPrice && (
                      <>
                        <span className="text-sm text-gray-500 line-through">
                          ₹{(item.originalPrice * item.quantity).toLocaleString()}
                        </span>
                        <span className="text-sm text-green-600">
                          ({Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) return <div className="p-8 text-lg text-gray-400 animate-pulse">Loading orders...</div>;
  if (error) return <div className="p-8 text-lg text-red-500">{error}</div>;
  if (!orders.length) return <div className="p-8 text-lg text-gray-500">No orders found.</div>;

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order Details
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Items
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {paginated.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.id}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.user.phone}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                        {order.user.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 py-1">
                            <div className="relative w-10 h-10 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
                              <img 
                                src={item.image || `/public/product-images/default.jpg`} 
                                alt={item.name}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src = '/product-images/default.jpg';
                                  target.className = 'w-full h-full object-contain opacity-50';
                                }}
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                  {item.name}
                                </p>
                                <span className="text-xs text-purple-600 dark:text-purple-400">
                                  ₹{item.price.toLocaleString()}
                                </span>
                                <span className="text-xs text-gray-500">×{item.quantity}</span>
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {item.size && <span className="mr-2">Size: {item.size}</span>}
                                {item.color && <span className="mr-2">Color: {item.color}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        ₹{order.total.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                      >
                        View Details
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && <OrderDetails order={selectedOrder} />}
      </AnimatePresence>
    </>
  );
}
