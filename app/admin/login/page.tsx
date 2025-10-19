"use client";
import { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const loginAsAdmin = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Check if the user is an admin
  const adminDoc = await getDoc(doc(db, 'admins', user.uid));
  if (!adminDoc.exists()) {
    throw new Error('Access denied. Not an admin user.');
  }
  
  // Store admin session
  sessionStorage.setItem('isAdmin', 'true');
  return user;
};

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      await loginAsAdmin(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6B46C1] via-[#9F7AEA] to-[#2D3748] relative overflow-hidden font-sans">
      <div className="absolute inset-0 z-0 opacity-40 animate-pulse" style={{background: 'radial-gradient(circle at 30% 30%, #6B46C1 0%, transparent 70%)'}}></div>
      {/* Toaster above the login form for attention */}
      <div className="absolute top-8 left-0 w-full flex justify-center z-50">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <Toaster position="top-center" reverseOrder={false} />
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 bg-white bg-opacity-90 rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <span className="bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] rounded-full p-3 animate-bounce">
              <svg width="40" height="40" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#6B46C1"/><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white" fontFamily="Arial">PA</text></svg>
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D3748] tracking-tight mb-2 animate-fade-in">Admin Login</h2>
          <p className="text-[#6B46C1] text-lg">Enter your credentials to access the admin dashboard.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-6 animate-fade-in">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#6B46C1] mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full px-4 py-3 bg-[#F7FAFC] border border-[#9F7AEA] rounded-xl text-[#2D3748] placeholder-[#9F7AEA] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 ${error ? 'border-red-500 animate-shake' : ''}`}
              placeholder="admin@example.com"
              required
              autoComplete="off"
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#6B46C1] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`mt-1 block w-full px-4 py-3 bg-[#F7FAFC] border border-[#9F7AEA] rounded-xl text-[#2D3748] placeholder-[#9F7AEA] focus:outline-none focus:ring-2 focus:ring-[#6B46C1] transition-all duration-300 pr-12 ${error ? 'border-red-500 animate-shake' : ''}`}
                placeholder="Password"
                required
                autoComplete="off"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B46C1] bg-transparent border-none cursor-pointer px-2 py-1 focus:outline-none"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-5.12M15 15a6.978 6.978 0 01-3 0m-3-3a6.978 6.978 0 010-3m6 6a6.978 6.978 0 010-3m-6-6a6.978 6.978 0 013 0m3 3a6.978 6.978 0 013 0" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-9 0a9 9 0 0118 0c0 2.21-1.79 4-4 4H8c-2.21 0-4-1.79-4-4z" /></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-[#6B46C1] to-[#9F7AEA] text-white shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:ring-offset-2 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" /></svg>
                Signing In...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
          {error && (
            <div className="text-red-400 text-center font-semibold animate-fade-in-down">{error}</div>
          )}
        </form>
        <div className="mt-8 text-center text-[#9F7AEA] text-xs opacity-70 animate-fade-in">© 2025 Padmaisha Admin Portal</div>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.7s ease; }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.5s ease; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>
    </div>
  );
}
