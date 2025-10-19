
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { toast } from 'react-hot-toast';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // TODO: Add your auth logic here
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up flow
        if (!name) {
          toast.error('Please enter your name');
          return;
        }
        if (password.length < 6) {
          toast.error('Password should be at least 6 characters');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        toast.success('Account created successfully!');
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: name
        }));
      } else {
        // Sign in flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        toast.success('Signed in successfully!');
        
        // Store user data
        localStorage.setItem('user', JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName
        }));
      }

      // Check for redirect
      const redirectPath = localStorage.getItem('checkout_redirect');
      if (redirectPath) {
        localStorage.removeItem('checkout_redirect');
        router.replace(redirectPath);
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      // Add custom parameters for Google sign-in
      provider.setCustomParameters({
        prompt: 'select_account',
        login_hint: email || undefined
      });

      // Enable one-tap sign-in
      provider.addScope('profile');
      provider.addScope('email');

      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        // Store the user data in local storage for persistence
        localStorage.setItem('user', JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        }));

        // Check if there's a redirect path stored
        const redirectPath = localStorage.getItem('checkout_redirect');
        if (redirectPath) {
          localStorage.removeItem('checkout_redirect'); // Clear the stored path
          router.replace(redirectPath);
        } else {
          router.replace('/');
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      if (error.code === 'auth/popup-blocked') {
        alert('Please allow pop-ups for this website to sign in with Google');
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User closed the popup, no need to show an error
        return;
      } else if (error.code === 'auth/cancelled-popup-request') {
        // Multiple popups were opened, no need to show an error
        return;
      } else {
        alert('Failed to sign in with Google. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-gray-900 to-black relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30" style={{background: 'radial-gradient(circle at 30% 30%, #22c55e 0%, transparent 70%)'}}></div>
      <div className="relative z-10 bg-black bg-opacity-80 rounded-3xl shadow-2xl max-w-md w-full p-0">
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-white text-center mb-2">
            {isSignUp ? 'Create Account' : 'Sign in to PADMAISHA'}
          </h2>
          <p className="text-gray-400 text-center mb-6">
            {isSignUp 
              ? 'Enter your details to create your account' 
              : 'Enter your data to sign in to your account'}
          </p>
          <div className="space-y-4 mb-4">
            <button type="button" onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-white bg-opacity-10 hover:bg-opacity-20 border border-gray-700 text-white font-semibold">
              <svg width="20" height="20" viewBox="0 0 48 48" fill="none"><path d="M44.5 20H24V28.5H35.7C34.5 33.1 30.7 36 25.9 36C20.1 36 15.5 31.4 15.5 25.6C15.5 19.8 20.1 15.2 25.9 15.2C28.2 15.2 30.3 16.1 31.9 17.5L36.7 13.1C33.8 10.6 30 9 25.9 9C16.7 9 9 16.7 9 25.6C9 34.5 16.7 42.2 25.9 42.2C34.1 42.2 41.2 35.7 41.2 27.7C41.2 26.7 41.1 25.8 41 24.9H25.9V20H44.5Z" fill="#4285F4"/></svg>
              Sign in with Google
            </button>
          </div>
          <div className="flex items-center mb-6">
            <div className="flex-grow h-px bg-gray-700" />
            <span className="mx-2 text-gray-400 text-sm">Or</span>
            <div className="flex-grow h-px bg-gray-700" />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your full name"
                  required={isSignUp}
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="example@email.com"
                required
                autoComplete="email"
                suppressHydrationWarning
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-700 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-green-500 hover:text-green-400">
                Forgot Password?
              </a>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 px-4 rounded-md hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign in'
              )}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-500 hover:text-green-400 text-sm font-medium"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
