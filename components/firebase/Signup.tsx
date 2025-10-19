// components/firebase/Signup.tsx
'use client';

import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, User, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Signup = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
  // Only allow signup if running in browser (not SSR)
  if (typeof window === 'undefined') throw new Error('Signup only allowed in browser');
  await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Signup successful!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
  // Only allow Google signup if running in browser (not SSR)
  if (typeof window === 'undefined') throw new Error('Google signup only allowed in browser');
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
      setSuccess('Signup successful!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg animate-fade-in">
      <form onSubmit={handleSignup} className="space-y-5">
        <h2 className="text-2xl font-bold text-center mb-2">Sign Up</h2>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            required
            autoComplete="email"
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 focus:outline-none"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && (
          <div className="flex items-center text-red-500 text-sm bg-red-50 border border-red-200 rounded px-2 py-1">
            <AlertCircle className="h-4 w-4 mr-1" /> {error}
          </div>
        )}
        {success && (
          <div className="flex items-center text-green-600 text-sm bg-green-50 border border-green-200 rounded px-2 py-1">
            <CheckCircle className="h-4 w-4 mr-1" /> {success}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-150 disabled:opacity-50 shadow-md"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}Sign Up
        </button>
        <button
          type="button"
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center mt-2 transition-all duration-150 disabled:opacity-50 shadow-md"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5 mr-2" />Sign Up with Google
        </button>
      </form>
    </div>
  );
};

export default Signup;
