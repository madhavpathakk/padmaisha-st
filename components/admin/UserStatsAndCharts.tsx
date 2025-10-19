import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFileInvoice, FaShoppingCart } from "react-icons/fa";
import { useUsers } from "@/hooks/useUsers";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#6B46C1", "#9F7AEA", "#38B2AC", "#F6AD55", "#ED64A6", "#68D391"];

type UserStats = {
  total: number;
  ordersPlaced: number;
  contacted: number;
  fulfilled: number;
};

interface UserType {
  name: string;
  status?: {
    contacted?: boolean;
    fulfilled?: boolean;
    order_placed?: boolean;
    notes?: string;
  };
  order_details?: {
    items?: any[];
  };
}

function UserStatsCards({ stats }: { stats: UserStats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <FaUsers size={32} className="mb-2" />
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm">Total Users</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="bg-gradient-to-r from-[#38B2AC] to-[#68D391] text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <FaShoppingCart size={32} className="mb-2" />
        <div className="text-2xl font-bold">{stats.ordersPlaced}</div>
        <div className="text-sm">Orders Placed</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} className="bg-gradient-to-r from-[#F6AD55] to-[#ED64A6] text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <FaPhone size={32} className="mb-2" />
        <div className="text-2xl font-bold">{stats.contacted}</div>
        <div className="text-sm">Contacted</div>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }} className="bg-gradient-to-r from-[#9F7AEA] to-[#6B46C1] text-white rounded-xl shadow-lg p-6 flex flex-col items-center">
        <FaFileInvoice size={32} className="mb-2" />
        <div className="text-2xl font-bold">{stats.fulfilled}</div>
        <div className="text-sm">Fulfilled</div>
      </motion.div>
    </div>
  );
}

function UserCharts({ users }: { users: UserType[] }) {
  // Pie chart for status distribution (flatten status object to readable string)
  const statusData = [
    { name: "Contacted", value: users.filter((u: UserType) => u.status?.contacted).length },
    { name: "Fulfilled", value: users.filter((u: UserType) => u.status?.fulfilled).length },
    { name: "Order Placed", value: users.filter((u: UserType) => u.status?.order_placed).length },
    { name: "Note", value: users.filter((u: UserType) => u.status?.notes).length },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-[#6B46C1]">User Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
  <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4 text-[#6B46C1]">Orders per User</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={users.map((u: UserType) => ({ name: u.name, orders: u.order_details?.items ? u.order_details.items.length : 0 }))}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="orders" fill="#6B46C1" radius={[8,8,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export { UserStatsCards, UserCharts };
