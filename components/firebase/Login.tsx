// components/firebase/Login.tsx
'use client';

import React, { useState } from 'react';
import { auth } from './firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { Eye, EyeOff, Mail, Lock, User, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

const Login = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useAuth();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await loginUser(email, password);
      setSuccess('Login successful!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess('Login successful!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('A password reset email has been sent. Please check your inbox or spam folder.');
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg animate-fade-in">
      <form onSubmit={handleLogin} className="space-y-5">
        <h2 className="text-2xl font-bold text-center mb-2">Login</h2>
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
            autoComplete="current-password"
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
        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              className="mr-2 accent-blue-600"
            />
            Remember me
          </label>
          <button type="button" className="text-blue-600 text-sm hover:underline" onClick={() => setShowForgot(true)}>
            Forgot password?
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
          {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <User className="h-5 w-5 mr-2" />}Login
        </button>
        <button
          type="button"
          className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-semibold flex items-center justify-center mt-2 transition-all duration-150 disabled:opacity-50 shadow-md"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <FcGoogle className="h-5 w-5 mr-2" />Login with Google
        </button>
      </form>
      {showForgot && (
        <div className="mt-4 p-4 border rounded bg-gray-50 animate-fade-in">
          <h3 className="font-semibold mb-2">Reset Password</h3>
          <div className="relative group mb-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
            />
          </div>
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center transition-all duration-150 disabled:opacity-50 shadow-md"
            onClick={handleForgotPassword}
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <Mail className="h-5 w-5 mr-2" />}Send Reset Email
          </button>
          <button className="w-full mt-2 text-sm text-gray-600 hover:underline" onClick={() => setShowForgot(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
