import { useState } from "react";
import { User } from "../models/user";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
type Props = { user: User; onClose: () => void };
import toast from "react-hot-toast";

export default function UserEditModal({ user, onClose, allowEditDetails }: Props & { allowEditDetails?: boolean }) {
  const defaultStatus = {
    contacted: false,
    fulfilled: false,
    order_placed: false,
    returned: false,
    replaced: false,
    notes: ""
  };
  const [status, setStatus] = useState({ ...defaultStatus, ...(user.status || {}) });
  const [notes, setNotes] = useState((user.status && user.status.notes) || "");
  const [loading, setLoading] = useState(false);

  // Editable fields
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [email, setEmail] = useState(user.email || "");
  const [gst, setGst] = useState(user.gst_no || "");
  const [address, setAddress] = useState(user.address || "");

  const handleSave = async () => {
    setLoading(true);
    try {
      const { db } = await import("@/lib/firebase");
      const { doc, updateDoc } = await import("firebase/firestore");
      const updateData: any = {
        status: { ...status, notes },
        updated_at: new Date(),
      };
      if (allowEditDetails) {
        updateData.name = name;
        updateData.phone = phone;
        updateData.email = email;
        updateData.gst_no = gst;
        updateData.address = address;
        updateData.user = {
          // ...user.user, // removed invalid spread
          name,
          phone,
          email,
          gst,
          address,
        };
      }
      await updateDoc(doc(db, "orders", user.id), updateData);
      toast.success("User details updated");
      onClose();
    } catch (err) {
      toast.error("Failed to update user details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-[#23232b] p-8 rounded-xl shadow-2xl w-full max-w-lg text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit User</h2>
        {allowEditDetails && (
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400" placeholder="Enter name" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Phone</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400" placeholder="Enter phone" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400" placeholder="Enter email" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">GST</label>
              <input type="text" value={gst} onChange={e => setGst(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400" placeholder="Enter GST" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Address</label>
              <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400" placeholder="Enter address" />
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Contacted</label>
            <input type="checkbox" checked={!!status.contacted} onChange={e => setStatus(s => ({ ...s, contacted: e.target.checked }))} className="mr-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Fulfilled</label>
            <input type="checkbox" checked={!!status.fulfilled} onChange={e => setStatus(s => ({ ...s, fulfilled: e.target.checked }))} className="mr-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Order Placed</label>
            <input type="checkbox" checked={!!status.order_placed} onChange={e => setStatus(s => ({ ...s, order_placed: e.target.checked }))} className="mr-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Returned</label>
            <input type="checkbox" checked={!!status.returned} onChange={e => setStatus(s => ({ ...s, returned: e.target.checked }))} className="mr-2" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Replaced</label>
            <input type="checkbox" checked={!!status.replaced} onChange={e => setStatus(s => ({ ...s, replaced: e.target.checked }))} className="mr-2" />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Notes</label>
          <textarea 
            value={notes} 
            onChange={e => setNotes(e.target.value)} 
            className="w-full p-3 rounded-lg border border-gray-700 bg-[#18181b] text-white placeholder:text-gray-400 min-h-[80px]" 
            placeholder="Enter notes..."
          />
        </div>
        <div className="flex gap-4 justify-end mt-4">
          <button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow">{loading ? "Saving..." : "Save"}</button>
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold shadow">Cancel</button>
        </div>
      </div>
    </div>
  );
}
