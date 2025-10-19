import React, { useState } from "react";
import { motion } from "framer-motion";

export default function WishlistCard({
  item,
  onAddToCart,
  onRequestQuote,
  onShare,
  onRemove,
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col"
      aria-label={`Wishlist item: ${item.name}`}
    >
      <div className="relative group mb-4">
        <div className="overflow-hidden rounded-lg">
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Carousel controls can be added here */}
      </div>
      <h3 className="text-lg font-bold mb-2">{item.name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 font-bold text-xl">₹{item.price}</span>
        <span className="ml-2 text-green-400 text-sm">{item.stock > 0 ? "In Stock" : "Out of Stock"}</span>
      </div>
      <p className="text-gray-300 mb-2">{item.description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Brand: {item.brand}</span>
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Material: {item.material}</span>
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Sizes: {item.sizes.join(", ")}</span>
        {/* Color swatches */}
        <div className="flex items-center gap-1">
          {item.colors.map(color => (
            <span
              key={color}
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: color }}
              aria-label={`Color: ${color}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto gap-2">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={item.stock}
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
            className="w-14 px-2 py-1 rounded bg-gray-700 text-white"
            aria-label="Quantity"
          />
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-bold transition-transform duration-150"
            onClick={() => onAddToCart(quantity)}
            aria-label="Add to Cart"
          >
            Add to Cart
          </button>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded font-bold"
          onClick={onRequestQuote}
          aria-label="Request Quote"
        >
          Request Quote
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-bold"
          onClick={onShare}
          aria-label="Share"
        >
          Share
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-bold"
          onClick={onRemove}
          aria-label="Remove from Wishlist"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}
