'use client';

import Link from "next/link";
import LegalPolicies from "@/components/LegalPolicies";

export default function ExchangePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-block mb-6 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition">← Back to Home</Link>
        <h1 className="text-3xl font-bold text-pink-600 mb-6">Exchange Policy</h1>
        <div className="prose prose-pink max-w-none">
          <LegalPolicies policyType="exchange" />
        </div>
      </div>
    </div>
  );
}
