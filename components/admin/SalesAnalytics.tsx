import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const fetchAnalytics = async () => {
  const { collection, query, where, getDocs, orderBy, Timestamp } = await import('firebase/firestore');
  const { db } = await import('@/lib/firebase');

  const ordersRef = collection(db, 'orders');
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  // Fetch all orders from the last 7 days for daily data
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  
  const ordersSnapshot = await getDocs(query(ordersRef, 
    where('timestamp', '>=', last7Days.getTime()),
    orderBy('timestamp', 'desc')
  ));

  const orders = ordersSnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
  }));

  // Calculate daily, weekly, and monthly totals
  const daily = orders
    .filter(order => order.timestamp >= startOfDay)
    .reduce((sum, order) => sum + order.total, 0);

  const weekly = orders
    .filter(order => order.timestamp >= startOfWeek)
    .reduce((sum, order) => sum + order.total, 0);

  const monthly = orders
    .filter(order => order.timestamp >= startOfMonth)
    .reduce((sum, order) => sum + order.total, 0);

  // Prepare data for bar chart (last 7 days)
  const dailyData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const end = start + 86400000; // + 24 hours

    const dayTotal = orders
      .filter(order => order.timestamp >= start && order.timestamp < end)
      .reduce((sum, order) => sum + order.total, 0);

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      total: dayTotal
    };
  }).reverse();

  // Prepare data for pie chart (order status distribution)
  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: dailyData.map(d => d.date),
    datasets: [{
      label: 'Sales',
      data: dailyData.map(d => d.total),
      backgroundColor: 'rgba(236,72,153,0.7)'
    }]
  };

  const pieData = {
    labels: Object.keys(statusCounts),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: [
        '#6366f1', // Shipped
        '#ec4899', // Delivered
        '#f59e42', // Cancelled
        '#fbbf24'  // Returned
      ]
    }]
  };

  return {
    daily,
    weekly,
    monthly,
    chartData,
    pieData
  };
};

const SalesAnalytics = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-6">Sales Analytics</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm font-semibold opacity-80">Today's Sales</div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <div className="animate-pulse bg-white/20 h-8 w-32 rounded" />
            ) : (
              `₹${(data?.daily || 0).toLocaleString()}`
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm font-semibold opacity-80">Weekly Sales</div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <div className="animate-pulse bg-white/20 h-8 w-32 rounded" />
            ) : (
              `₹${(data?.weekly || 0).toLocaleString()}`
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg p-6 shadow-lg">
          <div className="text-sm font-semibold opacity-80">Monthly Sales</div>
          <div className="text-3xl font-bold mt-2">
            {loading ? (
              <div className="animate-pulse bg-white/20 h-8 w-32 rounded" />
            ) : (
              `₹${(data?.monthly || 0).toLocaleString()}`
            )}
          </div>
        </div>
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-[300px] animate-pulse" />
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-[300px] animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Daily Sales Trend</h3>
            <Bar 
              data={data.chartData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => '₹' + Number(value).toLocaleString()
                    }
                  }
                }
              }} 
            />
          </div>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Order Status Distribution</h3>
            <Pie 
              data={data.pieData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right' as const,
                    labels: {
                      color: 'rgb(156, 163, 175)'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;
