import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 w-full">
      <h1 className="text-5xl font-extrabold text-pink-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-700 mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold shadow hover:bg-pink-500 transition">← Back to Homepage</Link>
    </main>
  );
}
