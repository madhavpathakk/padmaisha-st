"use client";
import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function AddUserModal() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", gst_no: "" });
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addDoc(collection(db, "users"), {
        ...form,
        status: { contacted: false, fulfilled: false, order_placed: false, notes: "" },
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      toast.success("User added");
      setOpen(false);
      setForm({ name: "", email: "", phone: "", address: "", gst_no: "" });
    } catch (err) {
      toast.error("Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded">Add User</button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#23232b] p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Add User</h2>
            {["name", "email", "phone", "address", "gst_no"].map((field) => (
              <div className="mb-2" key={field}>
                <label className="block font-semibold capitalize">{field.replace("_", " ")}</label>
                <input
                  type="text"
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full p-2 rounded border"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-4">
              <button onClick={handleAdd} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? "Adding..." : "Add"}</button>
              <button onClick={() => setOpen(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
