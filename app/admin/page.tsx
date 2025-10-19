"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import OrderTable from "../../components/OrderTable";
import { motion } from "framer-motion";
import { db } from "../../lib/firebase";
import { collection, query, where, onSnapshot, getDocs, getDoc, doc } from "firebase/firestore";
import {
  Users,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  Package,
  UserCheck,
  Bell,
  BarChart3,
  Plus,
  Edit3,
  Trash2,
  MessageCircle,
  CheckCircle
} from "lucide-react";
import StatsCard from "../../components/StatsCard";
import UserTable from "../../components/UserTable";
import AddUserModal from "../../components/AddUserModal";
import RevenueChart from "../../components/RevenueChart";

const statCards = [
  { title: "Total Users", icon: Users, color: "bg-blue-500", description: "Total registered users" },
  { title: "Total Orders", icon: ShoppingCart, color: "bg-green-500", description: "Total orders placed" },
  { title: "Revenue", icon: TrendingUp, color: "bg-purple-500", description: "Total revenue earned" },
  { title: "Pending Orders", icon: Package, color: "bg-yellow-500", description: "Orders awaiting fulfillment" },
  { title: "Total Sales", icon: CreditCard, color: "bg-red-500", description: "Number of successful sales" },
  { title: "Active Users", icon: UserCheck, color: "bg-indigo-500", description: "Users active in last 30 days" },
  { title: "Daily Revenue", icon: BarChart3, color: "bg-teal-500", description: "Revenue in last 24 hours" },
  { title: "Conversion Rate", icon: Bell, color: "bg-pink-500", description: "Order to visit ratio" }
];

type DashboardStats = {
  totalUsers: number;
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  totalSales: number;
  activeUsers: number;
  dailyRevenue: number;
  conversionRate: number;
};

type UserDoc = {
  id: string;
  status?: {
    contacted?: boolean;
    fulfilled?: boolean;
    order_placed?: boolean;
  };
  [key: string]: any;
};

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
    totalSales: 0,
    activeUsers: 0,
    dailyRevenue: 0,
    conversionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [activeTab, setActiveTab] = useState("User Management");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/admin/login");
      return;
    }

    if (!user || !isAdmin) return;

    const fetchStats = async () => {
      try {
        // Get users
        const usersSnap = await getDocs(collection(db, "users"));
        const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
        const totalUsers = usersSnap.size;

        // Get orders
        const ordersSnap = await getDocs(collection(db, "orders"));
        const ordersData = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
        const orders = ordersSnap.docs.map(doc => doc.data());
        const totalOrders = orders.length;
        const revenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const pendingOrders = orders.filter(order => order.status === "Pending").length;

        // Get active users (users who placed orders in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        // Get daily revenue (last 24 hours)
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        const recentOrdersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", oneDayAgo)
        );
        const recentOrdersSnap = await getDocs(recentOrdersQuery);
        const dailyRevenue = recentOrdersSnap.docs.reduce((sum, doc) => sum + (doc.data().total || 0), 0);

        // Get active users
        const activeUsersQuery = query(
          collection(db, "orders"),
          where("createdAt", ">=", thirtyDaysAgo)
        );
        const activeUsersSnap = await getDocs(activeUsersQuery);
        const activeUsers = new Set(activeUsersSnap.docs.map(doc => doc.data().userId)).size;

        // Get site visits from analytics collection (if available)
        const analyticsDoc = await getDoc(doc(db, "analytics", "visits"));
        const totalVisits = analyticsDoc.exists() ? analyticsDoc.data().total || 0 : 0;
        const conversionRate = totalVisits > 0 ? (totalOrders / totalVisits) * 100 : 0;

        setStats({
          totalUsers,
          totalOrders,
          revenue,
          pendingOrders,
          totalSales: totalOrders,
          activeUsers,
          dailyRevenue,
          conversionRate
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, router]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#18181b]">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {statCards.map((card, index) => {
            const Icon = card.icon;
            const getStatsKey = (title: string): keyof DashboardStats => {
              const keyMap: Record<string, keyof DashboardStats> = {
                "Total Users": "totalUsers",
                "Total Orders": "totalOrders",
                "Revenue": "revenue",
                "Pending Orders": "pendingOrders",
                "Total Sales": "totalSales",
                "Active Users": "activeUsers",
                "Daily Revenue": "dailyRevenue",
                "Conversion Rate": "conversionRate"
              };
              return keyMap[title];
            };
            const value = stats[getStatsKey(card.title)];
            
            return (
              <motion.div
                key={card.title}
                variants={item}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <StatsCard
                  title={card.title}
                  value={loading || value === undefined ? "-" : 
                    typeof value === 'number' ? value.toLocaleString("en-IN", {
                      style: card.title === "Revenue" || card.title === "Daily Revenue" ? "currency" : "decimal",
                      currency: "INR",
                      minimumFractionDigits: card.title === "Conversion Rate" ? 2 : 0
                    }) : "-"}
                  icon={<Icon className={`w-6 h-6 ${card.color.replace("bg-", "text-")}`} />}
                  color={card.color}
                  description={card.description}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue Overview</h2>
          <RevenueChart monthlyBreakdown={{}} />
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Users</h2>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
            <UserTable users={[]} loading={loading} />
          </div>
        </motion.div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() => {
            setShowAddUserModal(false);
            // Refresh stats after adding a user
            fetchStats();
          }}
        />
      )}
    </div>
  );
}