import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export function useRevenue() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyBreakdown, setMonthlyBreakdown] = useState<Record<string, number>>({});
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      const data = snap.docs.map(doc => doc.data());
      console.log("Fetched orders:", data);
      setOrders(data);
      // Calculate total revenue
      const total = data.reduce((sum, order) => sum + (order.total || 0), 0);
      setTotalRevenue(total);
      // Monthly breakdown
      const monthly: Record<string, number> = {};
      data.forEach(order => {
        if (order.createdAt && order.createdAt.seconds) {
          const date = new Date(order.createdAt.seconds * 1000);
          const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
          monthly[key] = (monthly[key] || 0) + (order.total || 0);
        }
      });
      setMonthlyBreakdown(monthly);
    });
    return () => unsub();
  }, []);
  return { totalRevenue, monthlyBreakdown, orders };
}
