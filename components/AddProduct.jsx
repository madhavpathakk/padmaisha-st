import React, { useState, useEffect } from "react";
import { db, storage } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import toast from "react-hot-toast";

const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function AddProduct() {
  // Form state
  const [form, setForm] = useState({
    name: "",
    brand: "",
    price: "",
    actualPrice: "",
    discountedPrice: "",
    sizes: [],
    description: "",
    image: null,
    imageUrl: "",
    additionalDetails: {
      color: "",
      fabric: "",
      style: ""
    }
  });
  const [brands, setBrands] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Fetch brands from Firestore
  useEffect(() => {
    async function fetchBrands() {
      const snap = await getDocs(collection(db, "brands"));
      setBrands(snap.docs.map(doc => doc.data().name));
    }
    fetchBrands();
  }, []);

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, files } = e.target;
    if (name === "image" && files && files[0]) {
      setForm(f => ({ ...f, image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else if (name.startsWith("additionalDetails.")) {
      const key = name.split(".")[1];
      setForm(f => ({ ...f, additionalDetails: { ...f.additionalDetails, [key]: value } }));
    } else if (name === "sizes") {
      const valArr = Array.from(e.target.selectedOptions, opt => opt.value);
      setForm(f => ({ ...f, sizes: valArr }));
    } else {
      setForm(f => ({ ...f, [name]: type === "number" ? Number(value) : value }));
    }
  }

  // Validate form
  function validate() {
    const errs = {};
    if (!form.name) errs.name = "Product name is required.";
    if (!form.brand) errs.brand = "Brand is required.";
    if (!form.price) errs.price = "Price is required.";
    if (!form.description) errs.description = "Description is required.";
    if (!form.image) errs.image = "Product image is required.";
    return errs;
  }

  // Handle submit
  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    let imageUrl = "";
    try {
      // Upload image to Firebase Storage
      if (form.image) {
        const imgRef = ref(storage, `product-images/${Date.now()}-${form.image.name}`);
        await uploadBytes(imgRef, form.image);
        imageUrl = await getDownloadURL(imgRef);
      } else {
        throw new Error("No image selected");
      }
      // Add product to Firestore
      await addDoc(collection(db, "products"), {
        name: form.name,
        brand: form.brand,
        price: Number(form.price),
        actualPrice: Number(form.actualPrice),
        discountedPrice: Number(form.discountedPrice),
        sizes: form.sizes,
        description: form.description,
        imageUrl,
        additionalDetails: form.additionalDetails,
        createdAt: serverTimestamp()
      });
      toast.success("Product added successfully!");
      setForm({
        name: "",
        brand: "",
        price: "",
        actualPrice: "",
        discountedPrice: "",
        sizes: [],
        description: "",
        image: null,
        imageUrl: "",
        additionalDetails: { color: "", fabric: "", style: "" }
      });
      setImagePreview("");
      setPreviewMode(false);
    } catch (err) {
      toast.error("Something went wrong, please try again. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  // Product preview card
  function ProductPreview() {
    return (
      <div className="bg-[#18181b] rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-md mx-auto mb-6">
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded mb-4" />}
        <div className="font-bold text-xl text-white mb-2">{form.name}</div>
        <div className="text-sm text-purple-400 mb-2">Brand: {form.brand}</div>
        <div className="text-green-400 font-bold mb-2">₹{form.discountedPrice || form.price}</div>
        {form.actualPrice && <div className="text-gray-400 line-through mb-2">₹{form.actualPrice}</div>}
        <div className="text-xs text-gray-300 mb-2">Sizes: {form.sizes.join(", ")}</div>
        <div className="text-sm text-gray-200 mb-2">{form.description}</div>
        <div className="text-xs text-gray-400">Color: {form.additionalDetails.color} | Fabric: {form.additionalDetails.fabric} | Style: {form.additionalDetails.style}</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#23232b] min-h-screen">
      <h1 className="text-2xl font-bold text-white mb-6">Add New Product</h1>
      <form className="bg-[#18181b] rounded-xl shadow-lg p-8 max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Product Name *</label>
          <input name="name" type="text" value={form.name} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Brand *</label>
          <select name="brand" value={form.brand} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none">
            <option value="">Select Brand</option>
            {brands.map((b, i) => <option key={b + '-' + i} value={b}>{b}</option>)}
          </select>
          {errors.brand && <div className="text-red-500 text-xs mt-1">{errors.brand}</div>}
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Price *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
            {errors.price && <div className="text-red-500 text-xs mt-1">{errors.price}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Actual Price</label>
            <input name="actualPrice" type="number" value={form.actualPrice} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Discounted Price</label>
            <input name="discountedPrice" type="number" value={form.discountedPrice} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Sizes Available</label>
          <select name="sizes" multiple value={form.sizes} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none">
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1">Product Image *</label>
          <input name="image" type="file" accept="image/*" onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          {errors.image && <div className="text-red-500 text-xs mt-1">{errors.image}</div>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
            <input name="additionalDetails.color" type="text" value={form.additionalDetails.color} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fabric</label>
            <input name="additionalDetails.fabric" type="text" value={form.additionalDetails.fabric} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Style</label>
            <input name="additionalDetails.style" type="text" value={form.additionalDetails.style} onChange={handleChange} className="w-full p-3 rounded bg-[#23232b] text-white border border-gray-700 focus:outline-none" />
          </div>
        </div>
        <div className="flex gap-4 mt-8 justify-end">
          <button
            type="button"
            className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-purple-700 transition"
            onClick={() => setPreviewMode(prev => !prev)}
          >
            {previewMode ? "Hide Preview" : "Preview Product"}
          </button>
          <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 transition">
            {loading ? "Adding..." : "Submit"}
          </button>
        </div>
      </form>
      {previewMode && <ProductPreview />}
    </div>
  );
}

// --- End of AddProduct.jsx ---
// This component provides a full-featured Add Product page for Padmaisha CRM Admin Dashboard.
// It includes Firestore and Firebase Storage integration, live image preview, product preview card, validation, and success/error handling.
// All UI is styled with Tailwind CSS and matches the dark theme of the dashboard.
// Future developers can easily extend this file for product management features.
