"use client";
import React, { useState } from "react";

const faqs = [
  {
    q: "How do I place a bulk order?",
    a: "Simply browse collections, add products to your cart, and select bulk order options at checkout.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit cards, UPI, and secure B2B payment gateways.",
  },
  {
    q: "How fast is shipping?",
    a: "Most orders ship within 24 hours. Express options available for retailers.",
  },
  {
    q: "Can I return products?",
    a: "Yes, we offer free returns for eligible products. See our policy for details.",
  },
];

const FAQAccordion = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <section className="max-w-3xl mx-auto py-12 px-4 md:px-8 mb-8 animate-fade-in-up">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={faq.q} className="border border-gray-200 rounded-xl bg-white/90 shadow">
            <button
              className={`w-full text-left px-6 py-4 font-semibold text-gray-800 flex justify-between items-center focus:outline-none transition-colors duration-300 ${openIdx === idx ? 'bg-pink-50' : ''}`}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              {faq.q}
              <span className={`ml-2 text-pink-500 transition-transform duration-300 ${openIdx === idx ? 'rotate-90' : ''}`}>▶</span>
            </button>
            <div
              className={`px-6 pb-4 text-gray-600 text-sm transition-all duration-300 ${openIdx === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
            >
              {faq.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQAccordion;
