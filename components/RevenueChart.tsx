"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const previousValue = payload[0].payload.previousValue;
    const percentageChange = previousValue
      ? ((value - previousValue) / previousValue) * 100
      : 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
          ₹{value.toLocaleString("en-IN")}
        </p>
        {previousValue && (
          <div className="flex items-center mt-2">
            {percentageChange > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-sm font-medium ${
                percentageChange > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(percentageChange).toFixed(1)}% vs previous
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function RevenueChart({ monthlyBreakdown }: { monthlyBreakdown: Record<string, number> }) {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        // Get orders sorted by date
        const ordersQuery = query(
          collection(db, "orders"),
          orderBy("createdAt", "asc")
        );
        const ordersSnap = await getDocs(ordersQuery);
        const orders = ordersSnap.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate()
        }));

        // Group orders by month and calculate monthly revenue
        const monthlyRevenue = orders.reduce((acc: { [key: string]: number }, order) => {
          if (!order.createdAt || !order.total) return acc;
          const month = order.createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          acc[month] = (acc[month] || 0) + order.total;
          return acc;
        }, {});

        // Transform data for chart with previous month comparison
        const chartData = Object.entries(monthlyRevenue).map(([month, value], index, array) => ({
          month,
          value,
          previousValue: index > 0 ? array[index - 1][1] : null
        }));

        setRevenueData(chartData);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Monthly Revenue Trend</h2>
        <div className="flex items-center justify-center h-[300px]">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Revenue Trend</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-600 rounded-full mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(158, 158, 158, 0.1)"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) =>
              `₹${value.toLocaleString("en-IN", {
                notation: "compact",
                compactDisplay: "short"
              })}`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#6366f1",
              strokeWidth: 3,
              fill: "#fff"
            }}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
