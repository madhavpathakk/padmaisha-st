"use client";
import React from "react";
import Image from "next/image";

const AboutPadmaisha = () => (
  <section className="w-full max-w-none px-2 sm:px-4 md:px-8 py-10 bg-white/90 rounded-3xl shadow-xl mt-10 mb-6 animate-fade-in-up group relative overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_0_64px_0_rgba(236,72,153,0.18),0_0_128px_0_rgba(139,92,246,0.15)] hover:bg-gradient-to-br hover:from-pink-50 hover:via-white hover:to-purple-50">
  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-none">
      <div className="flex-1">
        <h2 className="text-3xl md:text-4xl font-extrabold font-sans text-gray-900 mb-4">About Padmaisha</h2>
        <p className="text-lg text-gray-700 mb-6 font-light">
          <span className="font-semibold text-pink-600">Padmaisha</span> is the flagship B2B platform of Guruji Enterprises, dedicated to empowering retailers with exclusive, quality-driven clothing at competitive prices. Our mission is to foster seamless partnerships and elevate the retail experience through innovation, sustainability, and reliability.
        </p>
        <ul className="mb-6 space-y-2">
          <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-pink-400 rounded-full"></span> Sustainability</li>
          <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-purple-400 rounded-full"></span> Innovation</li>
          <li className="flex items-center gap-2"><span className="inline-block w-3 h-3 bg-indigo-400 rounded-full"></span> Reliability</li>
        </ul>
        <div className="relative mt-6">
          <div className="flex gap-8 bg-white/90 rounded-2xl transition-all duration-500 ease-in-out group hover:shadow-[0_0_40px_0_rgba(236,72,153,0.25),0_0_80px_0_rgba(139,92,246,0.18)] hover:bg-gradient-to-r hover:from-pink-100 hover:via-white hover:to-purple-100 hover:scale-105">
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold text-purple-600">500+</span>
              <div className="text-xs text-gray-500">Brands</div>
            </div>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold text-pink-600">1000+</span>
              <div className="text-xs text-gray-500">Retailers Served</div>
            </div>
            <div className="text-center">
              <span className="text-2xl md:text-3xl font-bold text-indigo-600">24hr</span>
              <div className="text-xs text-gray-500">Shipping</div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center">
          <Image
            src="/brands/logo.png"
            alt="Padmaisha Logo"
            width={180}
            height={180}
            className="mb-4"
            style={{
              borderRadius: '50%',
              boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
              border: '2px solid #f3f3f3',
              background: '#fff',
            }}
          />
        <div className="text-center">
          <span className="block text-lg font-semibold text-gray-800 mb-1">Guruji Enterprises Founder</span>
          <span className="block text-sm text-gray-500 italic">“Empowering retailers with style, quality, and trust.”</span>
        </div>
      </div>
    </div>
  <div style={{ marginBottom: '56px' }} />
  </section>
);

export default AboutPadmaisha;
