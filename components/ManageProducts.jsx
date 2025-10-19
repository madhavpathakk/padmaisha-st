import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setEditId(product.id);
    setEditForm({ ...product });
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, "products", editId), {
        ...editForm,
        updatedAt: serverTimestamp()
      });
      toast.success("Product updated");
      setEditId(null);
      fetchProducts();
    } catch {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 bg-[#23232b] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Products</h1>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name or brand..."
        className="mb-6 p-3 rounded bg-[#18181b] text-white border border-gray-700 w-full max-w-md"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm rounded-xl">
          <thead className="bg-[#23232b]">
            <tr>
              <th className="px-4 py-2 text-left text-gray-300">Image</th>
              <th className="px-4 py-2 text-left text-gray-300">Name</th>
              <th className="px-4 py-2 text-left text-gray-300">Brand</th>
              <th className="px-4 py-2 text-left text-gray-300">Price</th>
              <th className="px-4 py-2 text-left text-gray-300">Sizes</th>
              <th className="px-4 py-2 text-left text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-[#18181b]">
            {filtered.map(product => (
              <tr key={product.id} className="border-b border-gray-800">
                <td className="px-4 py-2">
                  {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded" />}
                </td>
                <td className="px-4 py-2 text-white font-semibold">{product.name}</td>
                <td className="px-4 py-2 text-gray-300">{product.brand}</td>
                <td className="px-4 py-2 text-green-400 font-bold">₹{product.discountedPrice || product.price}</td>
                <td className="px-4 py-2 text-gray-300">{Array.isArray(product.sizes) ? product.sizes.join(", ") : "-"}</td>
                <td className="px-4 py-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-full mr-2" onClick={() => handleEdit(product)}>Edit</button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded-full" onClick={() => handleDelete(product.id)} disabled={loading}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editId && (
        <form className="bg-[#18181b] rounded-xl shadow-lg p-8 max-w-xl mx-auto mt-8" onSubmit={handleEditSubmit}>
          <h2 className="text-lg font-bold text-white mb-4">Edit Product</h2>
          <input name="name" type="text" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="mb-4 w-full p-3 rounded bg-[#23232b] text-white border border-gray-700" />
          <input name="brand" type="text" value={editForm.brand} onChange={e => setEditForm(f => ({ ...f, brand: e.target.value }))} className="mb-4 w-full p-3 rounded bg-[#23232b] text-white border border-gray-700" />
          <input name="price" type="number" value={editForm.price} onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} className="mb-4 w-full p-3 rounded bg-[#23232b] text-white border border-gray-700" />
          <input name="discountedPrice" type="number" value={editForm.discountedPrice} onChange={e => setEditForm(f => ({ ...f, discountedPrice: e.target.value }))} className="mb-4 w-full p-3 rounded bg-[#23232b] text-white border border-gray-700" />
          <textarea name="description" value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} className="mb-4 w-full p-3 rounded bg-[#23232b] text-white border border-gray-700" rows={3} />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
          <button type="button" className="ml-4 bg-gray-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-gray-700 transition" onClick={() => setEditId(null)}>Cancel</button>
        </form>
      )}
    </div>
  );
}
// --- End of ManageProducts.jsx ---
// This component provides a full-featured product management tab for Padmaisha CRM Admin Dashboard.
// Admins can search, edit, and delete products. All UI is styled with Tailwind CSS and matches the dark theme.
// Future developers can easily extend this file for more product management features.
