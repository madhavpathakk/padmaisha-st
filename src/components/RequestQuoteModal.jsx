import React, { useState } from "react";
import { motion } from "framer-motion";

export default function RequestQuoteModal({ item, onClose }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Validate and send quote request (demo only)
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white text-gray-900 rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-xl font-bold mb-4">Request Quote for {item.name}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            required
            placeholder="Your Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="border px-3 py-2 rounded"
            aria-label="Email"
          />
          <textarea
            required
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="border px-3 py-2 rounded"
            aria-label="Message"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-500 text-white font-bold"
            >
              Send Request
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
