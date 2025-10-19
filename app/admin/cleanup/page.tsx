"use client";
import { useState } from 'react';
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function CleanupPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const clearAllData = async () => {
    if (!window.confirm("⚠️ WARNING: This will delete all users, orders, and related data. This action cannot be undone. Are you sure?")) {
      return;
    }

    setLoading(true);
    setMessage("Starting cleanup...");
    try {
      // Clear Users Collection
      setMessage("Deleting users...");
      const usersSnapshot = await getDocs(collection(db, "users"));
      for (const document of usersSnapshot.docs) {
        await deleteDoc(doc(db, "users", document.id));
      }

      // Clear Orders Collection
      setMessage("Deleting orders...");
      const ordersSnapshot = await getDocs(collection(db, "orders"));
      for (const document of ordersSnapshot.docs) {
        await deleteDoc(doc(db, "orders", document.id));
      }

      // Clear Products Collection
      setMessage("Deleting products...");
      const productsSnapshot = await getDocs(collection(db, "products"));
      for (const document of productsSnapshot.docs) {
        await deleteDoc(doc(db, "products", document.id));
      }

      // Clear Cart Collection
      setMessage("Deleting carts...");
      const cartsSnapshot = await getDocs(collection(db, "carts"));
      for (const document of cartsSnapshot.docs) {
        await deleteDoc(doc(db, "carts", document.id));
      }

      // Reset Analytics
      setMessage("Resetting analytics...");
      const analyticsRef = doc(db, "analytics", "visits");
      await deleteDoc(analyticsRef);

      setMessage("✅ All data has been cleared successfully! You can now start fresh.");
    } catch (error) {
      console.error("Error during cleanup:", error);
      setMessage("❌ Error during cleanup: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Database Cleanup
          </h2>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              This will delete all:
              <ul className="list-disc ml-5 mt-2">
                <li>Users and their profiles</li>
                <li>Orders and order history</li>
                <li>Products</li>
                <li>Shopping carts</li>
                <li>Analytics data</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  ⚠️
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    <p>
                      This action cannot be undone. Make sure you have backups if needed.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={clearAllData}
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Cleaning...' : 'Clear All Data'}
            </button>

            {message && (
              <div className={`mt-4 p-4 rounded-md ${
                message.includes('Error') 
                  ? 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200' 
                  : message.includes('success')
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                  : 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
