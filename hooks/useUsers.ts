"use client";
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { User } from "../models/user";
import toast from "react-hot-toast";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [stats, setStats] = useState({ total: 0, contacted: 0, fulfilled: 0, ordersPlaced: 0 });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(undefined);

    const fetchUsers = () => {
      const unsub = onSnapshot(
        collection(db, "users"),
        (snapshot) => {
          try {
            const data = snapshot.docs.map((doc) => {
              const userData = doc.data();
              return {
                id: doc.id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                address: userData.address,
                gst: userData.gst,
                status: {
                  contacted: userData.status?.contacted || false,
                  fulfilled: userData.status?.fulfilled || false,
                  order_placed: userData.status?.order_placed || false,
                  returned: userData.status?.returned || false,
                  replaced: userData.status?.replaced || false,
                  notes: userData.status?.notes || "",
                },
                createdAt: userData.createdAt?.toDate(),
                updatedAt: userData.updatedAt?.toDate(),
              };
            });

            setUsers(data);
            setStats({
              total: data.length,
              contacted: data.filter(u => u.status?.contacted).length,
              fulfilled: data.filter(u => u.status?.fulfilled).length,
              ordersPlaced: data.filter(u => u.status?.order_placed).length,
            });
          } catch (err: any) {
            console.error("Error processing users data:", err);
            setError(err.message || "Failed to process users data");
            toast.error("Error loading users");
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error("Error fetching users:", err);
          setError("Failed to load users");
          toast.error("Error loading users");
          setLoading(false);
        }
      );
      return unsub;
    };

    const unsubscribe = fetchUsers();
    return () => unsubscribe();
  }, []);

  const refreshUsers = () => {
    setRefreshKey(key => key + 1);
  };

  return { users, loading, error, stats, refreshUsers };
}
