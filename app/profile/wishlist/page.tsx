// Padmaisha Wishlist Page
// Professional, innovative, and aesthetic full-page layout for B2B fashion e-commerce

"use client";
import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";
import { FaHeart, FaTrash, FaShareAlt, FaCartPlus } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Sample data for demo products
const demoWishlist = [
  {
    id: "1",
    name: "Urja & WACCHI Dress",
    price: 2406,
    description: "Premium quality dress for all seasons.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["#000", "#fff", "#e53e3e"],
    material: "Cotton Blend",
    brand: "Urja & WACCHI",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=400&fit=crop"
    ],
    dateAdded: "2025-09-29T14:30:00Z"
  },
  {
    id: "2",
    name: "Lasoon Blazer",
    price: 3200,
    description: "Elegant blazer for business meetings.",
    sizes: ["M", "L", "XL"],
    colors: ["#2d3748", "#e53e3e"],
    material: "Wool",
    brand: "Lasoon",
    stock: 5,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=400&h=400&fit=crop"
    ],
    dateAdded: "2025-09-28T10:00:00Z"
  }
];

// Remove local WishlistContext, use global AppContext

// Wishlist Item Card
function WishlistCard({ item }: { item: any }) {
  const { dispatch } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(
    Array.isArray(item.colors) && item.colors.length > 0 ? item.colors[0] : "#e53e3e"
  );
  const [quantity, setQuantity] = useState(1);
  const [showConfirm, setShowConfirm] = useState(false);
  const [zoom, setZoom] = useState(false);

  // Remove item from wishlist
  function removeItem() {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: item.id });
    setShowConfirm(false);
    toast.success("Removed from wishlist!");
  }

  // Share item
  function shareItem() {
    try {
      if (navigator.share) {
        navigator.share({
          title: item.name,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(
          `${item.name} - ₹${item.price}\n${item.description}\n${window.location.href}`
        );
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Unable to share.");
    }
  }

  // Add to cart
  function addToCart() {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...item,
          image: item.image || (Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : "/brands/logo.png"),
        },
        size: Array.isArray(item.sizes) && item.sizes.length > 0 ? item.sizes[0] : "M",
      },
    });
    toast.success(`Added ${quantity} x ${item.name} to cart!`);
  }

  // Request quote (demo)
  function requestQuote() {
    toast.success("Quote requested!");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 rounded-2xl shadow-xl p-6 flex flex-col gap-4 relative group"
      aria-label={`Wishlist item: ${item.name}`}
    >
      {/* Image carousel with zoom */}
      <div className="relative">
        <div
          className="overflow-hidden rounded-xl border border-gray-700"
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
                  <img
            src={item.image || (item.images && item.images.length > 0 ? item.images[imgIdx] : "/brands/logo.png")}
            alt={item.name}
            className={`w-full h-56 object-cover transition-transform duration-300 ${zoom ? "scale-110" : "scale-100"}`}
          />
        </div>
  {Array.isArray(item.images) && item.images.length > 1 && (
          <div className="absolute bottom-2 right-2 flex gap-2 bg-black/40 rounded-full px-2 py-1">
            <button
              aria-label="Previous image"
              onClick={() => setImgIdx((idx) => (idx === 0 ? item.images.length - 1 : idx - 1))}
              className="text-white hover:text-red-400"
            >
              <FiChevronLeft />
            </button>
            <button
              aria-label="Next image"
              onClick={() => setImgIdx((idx) => (idx === item.images.length - 1 ? 0 : idx + 1))}
              className="text-white hover:text-red-400"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      {/* Dynamic color swatches */}
      <div className="flex gap-2 items-center">
        {Array.isArray(item.colors) && item.colors.length > 0 &&
          item.colors.map((color: string) => (
            <button
              key={color}
              aria-label={`Select color ${color}`}
              className={`w-6 h-6 rounded-full border-2 ${selectedColor === color ? "border-red-500" : "border-gray-400"}`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
            />
          ))
        }
      </div>
      {/* Item details */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">{item.name}</span>
          <span className="ml-auto text-red-400 font-bold text-xl">₹{item.price}</span>
        </div>
        <div className="text-gray-300 text-sm mb-1">{item.description}</div>
        <div className="flex gap-2 text-xs text-gray-400">
          <span>Brand: <span className="font-semibold text-white">{item.brand}</span></span>
          <span>Material: {item.material}</span>
          <span>Stock: <span className={item.stock > 0 ? "text-green-400" : "text-red-400"}>{item.stock > 0 ? "In Stock" : "Out of Stock"}</span></span>
        </div>
        <div className="flex gap-2 mt-2">
          <span>Sizes:</span>
          {item.sizes.map((size: string) => (
            <span key={size} className="px-2 py-1 bg-gray-800 rounded text-white text-xs border border-gray-600">{size}</span>
          ))}
        </div>
      </div>
      {/* Actions - aligned and functional */}
      <div className="flex flex-row flex-wrap gap-2 mt-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={item.stock}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-16 px-2 py-1 rounded bg-gray-800 text-white border border-gray-600 text-center"
            aria-label="Quantity"
          />
          <button
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-bold flex items-center gap-2"
            onClick={addToCart}
            aria-label="Add to cart"
          >
            <FaCartPlus /> Add to Cart
          </button>
        </div>
        <button
          className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-bold flex items-center gap-2"
          onClick={requestQuote}
          aria-label="Request quote"
        >
          Request Quote
        </button>
        <button
          className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-bold flex items-center gap-2"
          onClick={shareItem}
          aria-label="Share item"
        >
          <FaShareAlt /> Share
        </button>
        <button
          className="px-3 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded font-bold flex items-center gap-2"
          onClick={() => setShowConfirm(true)}
          aria-label="Remove item"
        >
          <FaTrash /> Remove
        </button>
      </div>
      {/* Remove confirmation */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-2xl"
          >
            <div className="bg-white rounded-lg p-6 text-center shadow-xl">
              <div className="text-lg font-bold mb-2 text-red-600">Remove from Wishlist?</div>
              <div className="mb-4 text-gray-700">Are you sure you want to remove <span className="font-semibold">{item.name}</span>?</div>
              <div className="flex gap-4 justify-center">
                <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowConfirm(false)}>Cancel</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={removeItem}>Remove</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Sorting and Filtering
function WishlistSortFilter({ onSort, onFilter }: { onSort: any, onFilter: any }) {
  return (
    <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
      <div className="flex gap-2">
        <label className="text-gray-300">Sort by:</label>
        <select className="bg-gray-800 text-white rounded px-2 py-1" onChange={e => onSort(e.target.value)}>
          <option value="date">Date Added</option>
          <option value="price">Price</option>
        </select>
      </div>
      <div className="flex gap-2">
        <label className="text-gray-300">Filter by:</label>
        <select className="bg-gray-800 text-white rounded px-2 py-1" onChange={e => onFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="size">Size</option>
          <option value="color">Color</option>
          <option value="brand">Brand</option>
        </select>
      </div>
    </div>
  );
}

// Main Wishlist Page
export default function WishlistPage() {
  const { state } = useApp();
  const wishlist = state.wishlist;
  const [sort, setSort] = useState("date");
  const [filter, setFilter] = useState("all");

  // Sorting logic
  let sortedWishlist = [...wishlist];
  sortedWishlist.sort((a, b) => b.price - a.price);

  // Filtering logic (demo)
  if (filter === "brand") {
    sortedWishlist = sortedWishlist.filter(item => item.brand === "Urja & WACCHI");
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center py-10 px-2">
      <header className="w-full max-w-6xl mx-auto mb-8 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight text-center">
          <span className="text-red-500">Unleash Your Retail Style</span> with Padmaisha
        </h1>
        <p className="text-lg text-gray-300 text-center max-w-2xl">
          Premium B2B Clothing for Retailers – Exclusive Brands, Affordable Prices
        </p>
      </header>
      <WishlistSortFilter onSort={setSort} onFilter={setFilter} />
      {sortedWishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaHeart size={64} className="text-red-500 mb-4 animate-bounce" />
          <div className="text-2xl font-bold text-white mb-2">Your wishlist is empty!</div>
          <div className="text-gray-400 mb-6">Start exploring premium brands and add your favorite products.</div>
          <Link href="/brands" className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold shadow hover:bg-red-600 transition">Browse Brands</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
          <AnimatePresence>
            {sortedWishlist.map(item => (
              <WishlistCard key={item.id} item={item} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// To use: Wrap your app/_app.tsx or page with <WishlistProvider> for context.
