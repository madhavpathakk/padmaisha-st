"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      setOrders(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Orders Dashboard</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 rounded mb-4">
            <p><b>Order ID:</b> {order.id}</p>
            <p><b>User ID:</b> {order.user?.id || order.userId}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Total:</b> ₹{order.total}</p>
            <div>
              <h4 className="font-medium">Items:</h4>
              <ul className="list-disc pl-5">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.name} x {item.quantity} - ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
