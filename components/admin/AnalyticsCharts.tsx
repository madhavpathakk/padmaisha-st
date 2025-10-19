import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
// You can use recharts or chart.js for charts. Here is a placeholder.

export default function AnalyticsCharts() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(doc => doc.data()));
    });
    return () => unsub();
  }, []);

  // Calculate metrics
  const totalUsers = users.length;
  const contacted = users.filter(u => u.status?.contacted).length;
  const fulfilled = users.filter(u => u.status?.fulfilled).length;
  const orderPlaced = users.filter(u => u.status?.order_placed).length;

  return (
    <div style={{marginBottom: 32}}>
      <h2>Analytics</h2>
      <div>Total Users: {totalUsers}</div>
      <div>Contacted: {contacted}</div>
      <div>Fulfilled: {fulfilled}</div>
      <div>Order Placed: {orderPlaced}</div>
      {/* Add charts here using recharts or chart.js */}
    </div>
  );
}
