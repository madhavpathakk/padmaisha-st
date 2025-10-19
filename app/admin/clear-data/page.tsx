"use client";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

export default function ClearData() {
  const clearAllUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, "users"));
      const deletePromises = usersSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert("All users have been deleted successfully!");
    } catch (error) {
      console.error("Error deleting users:", error);
      alert("Error deleting users: " + error.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Clear Data</h1>
      <button
        onClick={clearAllUsers}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete All Users
      </button>
    </div>
  );
}
