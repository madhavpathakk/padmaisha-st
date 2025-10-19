import React from "react";
import { motion } from "framer-motion";

export default function ProductCard({
  product,
  inWishlist,
  onAddToCart,
  onToggleWishlist,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white bg-opacity-5 rounded-xl shadow-lg p-6 relative"
      aria-label={`Product: ${product.name}`}
    >
      <div className="relative group mb-4">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
        <button
          className={`absolute top-2 right-2 p-2 rounded-full bg-white bg-opacity-80 shadow ${
            inWishlist ? "text-red-500" : "text-gray-400"
          }`}
          onClick={onToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.svg
            initial={false}
            animate={{ scale: inWishlist ? 1.2 : 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-6 h-6"
            fill={inWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </motion.svg>
        </button>
      </div>
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-400 font-bold text-xl">₹{product.price}</span>
        <span className="ml-2 text-green-400 text-sm">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
      </div>
      <p className="text-gray-300 mb-2">{product.description}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Brand: {product.brand}</span>
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Material: {product.material}</span>
        <span className="bg-gray-700 px-2 py-1 rounded text-xs">Sizes: {product.sizes.join(", ")}</span>
        {/* Color swatches */}
        <div className="flex items-center gap-1">
          {product.colors.map(color => (
            <span
              key={color}
              className="w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: color }}
              aria-label={`Color: ${color}`}
            />
          ))}
        </div>
      </div>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold w-full mt-2 transition-transform duration-150"
        onClick={onAddToCart}
        aria-label="Add to Cart"
      >
        Add to Cart
      </button>
    </motion.div>
  );
}
