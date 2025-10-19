import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function WishlistEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="mb-6"
      >
        <svg
          className="w-20 h-20 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      </motion.div>
      <h2 className="text-xl font-semibold mb-4 text-center">
        Your wishlist is empty.<br />
        <span className="text-gray-400 font-normal">
          Start adding premium items to curate your retail collection!
        </span>
      </h2>
      <Link to="/products">
        <motion.button
          whileHover={{ scale: 1.08 }}
          className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg"
        >
          Browse Products
        </motion.button>
      </Link>
    </div>
  );
}
