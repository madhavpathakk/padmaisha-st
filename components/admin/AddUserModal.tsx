import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function AddUserModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    gst_no: "",
    status: { contacted: false, fulfilled: false, order_placed: false, notes: "" },
    order_details: { items: [], total_amount: 0, date: Timestamp.now() },
    created_at: Timestamp.now(),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    await addDoc(collection(db, "users"), form);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{background: '#fff', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #0002'}}>
      <h3>Add New User</h3>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" /><br/>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" /><br/>
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" /><br/>
      <input name="address" value={form.address} onChange={handleChange} placeholder="Address" /><br/>
      <input name="gst_no" value={form.gst_no} onChange={handleChange} placeholder="GST No" /><br/>
      <div style={{marginTop: 12}}>
        <button onClick={onClose} disabled={loading}>Cancel</button>
        <button onClick={handleSave} disabled={loading} style={{marginLeft: 8}}>Save</button>
      </div>
    </div>
  );
}
