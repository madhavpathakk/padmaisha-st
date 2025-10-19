"use client";
import React from "react";
import Image from "next/image";

const testimonials = [
  {
    name: "Amit Retailers",
    quote: "Padmaisha’s fast shipping and premium brands helped us grow our business!",
    rating: 5,
    image: "/brands/testimonial1.jpg",
  },
  {
    name: "FashionMart",
    quote: "Quality and style are unmatched. Our customers love the collections!",
    rating: 5,
    image: "/brands/testimonial2.jpg",
  },
  {
    name: "StyleHub",
    quote: "Bulk orders are seamless and support is excellent. Highly recommended!",
    rating: 4,
    image: "/brands/testimonial3.jpg",
  },
];

const Testimonials = () => (
  <section className="w-full px-2 sm:px-4 md:px-8 py-10 mb-6 animate-fade-in-up">
    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">What Retailers Say</h2>
    <div
      className="relative w-full overflow-hidden"
      style={{ height: '340px' }}
    >
      <div
        className="flex gap-8 marquee"
        style={{
          width: 'max-content',
          animation: 'marquee 30s linear infinite',
        }}
        onMouseEnter={e => { e.currentTarget.style.animationPlayState = 'paused'; }}
        onMouseLeave={e => { e.currentTarget.style.animationPlayState = 'running'; }}
      >
        {[...testimonials, ...testimonials].map((t, idx) => (
          <div key={t.name + idx} className="min-w-[320px] max-w-sm bg-white/90 rounded-2xl shadow-xl p-6 flex flex-col items-center snap-center transition-transform duration-500 hover:scale-105">
            <div className="rounded-full bg-pink-100 text-pink-600 w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold">
              {t.name.split(' ').map(word => word[0]).join('').toUpperCase()}
            </div>
            <div className="flex gap-1 mb-2">
              {[...Array(t.rating)].map((_, i) => (
                <span key={i} className="text-pink-500 text-lg">★</span>
              ))}
            </div>
            <blockquote className="text-gray-700 italic mb-3">“{t.quote}”</blockquote>
            <div className="text-sm font-semibold text-gray-900">{t.name}</div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  </section>
);

export default Testimonials;
