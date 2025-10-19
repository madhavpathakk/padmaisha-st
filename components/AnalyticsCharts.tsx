import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AnalyticsCharts() {
  // Example data, replace with Firestore queries
  const statusData = [
    { name: "Contacted", value: 40 },
    { name: "Fulfilled", value: 30 },
    { name: "Order Placed", value: 20 },
    { name: "Pending", value: 10 },
  ];
  const barData = [
    { month: "Jan", revenue: 10000 },
    { month: "Feb", revenue: 12000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 18000 },
  ];
  const lineData = [
    { month: "Jan", users: 100 },
    { month: "Feb", users: 120 },
    { month: "Mar", users: 150 },
    { month: "Apr", users: 180 },
  ];
  const COLORS = ["#6366f1", "#22c55e", "#f59e42", "#ef4444"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Status Distribution</h2>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Monthly Revenue</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white dark:bg-[#23232b] rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">User Growth</h2>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
