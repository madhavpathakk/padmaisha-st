'use client';
import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { FaUserCircle, FaHeart } from 'react-icons/fa';

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { state } = useApp();
  const cartItemCount = state.cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const wishlist = Array.isArray(state.wishlist) ? state.wishlist : [];

  // Auth context for user info and logout
  const { user, loading, logout, isAdmin } = useAuth();

  React.useEffect(() => {
    const handler = (e: any) => {
      setShowMiniCart(true);
      // auto-hide after 3.5s
      setTimeout(() => setShowMiniCart(false), 3500);
    };
    window.addEventListener('padmaisha:cart-updated', handler as EventListener);
    return () => window.removeEventListener('padmaisha:cart-updated', handler as EventListener);
  }, []);

  return (
    <nav className="fixed top-0 z-[100] bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm w-full transition-all duration-300 hover:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="font-extrabold text-3xl tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">Padmaisha</span>
        </Link>
        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-gray-600 font-medium text-base">
          <li><Link href="/" className="hover:text-pink-600 transition duration-200">Home</Link></li>
          <li><Link href="/brands" className="hover:text-pink-600 transition duration-200">Brands</Link></li>
          <li><Link href="/products" className="hover:text-pink-600 transition duration-200">Products</Link></li>
          <li><Link href="/pricing" className="hover:text-pink-600 transition duration-200">Pricing</Link></li>
          <li><Link href="/contact" className="hover:text-pink-600 transition duration-200">Contact</Link></li>
        </ul>
        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative">
            <input
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow bg-white placeholder-gray-400 transition-all"
              placeholder="Search products..."
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-pink-400 h-5 w-5" />
          </div>
          <Link href="/cart">
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-pink-100 hover:bg-pink-200 transition text-pink-700 shadow relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>
              )}
            </button>
          </Link>
          <Link href="/profile/wishlist" aria-label="Wishlist" className="relative">
            <button className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-pink-100 transition text-pink-500 shadow relative">
              <FaHeart size={22} />
              <span className="hidden md:inline">Wishlist</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{wishlist.length}</span>
              )}
            </button>
          </Link>
          <div className="relative">
            <button
              id="profile-btn"
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-blue-100 transition text-blue-700 shadow"
              onClick={() => setShowProfile((prev) => !prev)}
            >
              <FaUserCircle size={22} />
            </button>
            {showProfile && (
              <div id="profile-dropdown" className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-50 p-4 border">
                <div className="font-semibold text-lg mb-2">{user ? `Welcome, ${user.displayName || user.email}` : 'Welcome'}</div>
                <div className="text-sm text-gray-600 mb-2">To access account and manage orders</div>
                {!user ? (
                  <button className="mt-2 w-full py-2 bg-pink-500 text-white font-bold rounded" onClick={() => { window.location.href = '/login'; }}>LOGIN / SIGNUP</button>
                ) : (
                  <button
                    className="mt-2 w-full py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                    onClick={() => { logout(); setShowProfile(false); }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
                      Sign Out
                    </span>
                  </button>
                )}
                <hr className="my-2" />
                <ul className="space-y-2 text-gray-800">
                  <li><Link href="/profile/orders" onClick={() => setShowProfile(false)}><span>Orders</span></Link></li>
                  <li><Link href="#" onClick={() => setShowProfile(false)}><span>Wishlist</span></Link></li>
                  <li><Link href="#" onClick={() => setShowProfile(false)}><span>Gift Cards</span></Link></li>
                  <li><Link href="#" onClick={() => setShowProfile(false)}><span>Contact Us</span></Link></li>
                  {/* Admin Dashboard option for admin user only */}
                  <li>
                    <Link
                      href="/admin/login"
                      onClick={() => setShowProfile(false)}
                      className="block w-full py-2 mt-2 text-center font-bold rounded-lg bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg hover:from-pink-600 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* Cart icon beside hamburger for mobile */}
        <div className="flex items-center gap-4 md:hidden">
          <Link href="/cart">
            <button className="relative p-2 rounded-full bg-pink-100 hover:bg-pink-200 transition-all duration-300 text-pink-700 shadow-md hover:shadow-pink-200">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">{cartItemCount}</span>
              )}
            </button>
          </Link>
          <button 
            className="relative p-2 rounded-xl bg-blue-50 hover:bg-blue-100 transition-all duration-300 text-blue-600 shadow-md hover:shadow-blue-200 group"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <div className="flex flex-col gap-1.5 items-end">
              <span className="w-6 h-0.5 bg-current transition-all duration-300 group-hover:w-4"></span>
              <span className="w-4 h-0.5 bg-current transition-all duration-300 group-hover:w-6"></span>
              <span className="w-6 h-0.5 bg-current transition-all duration-300 group-hover:w-4"></span>
            </div>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-lg w-screen h-screen flex flex-col p-0 animate-in fade-in duration-200 overflow-y-auto">
          <div className="sticky top-0 w-full flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-50 to-pink-50 border-b border-gray-100 shadow-sm z-10">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-600 to-pink-600 text-transparent bg-clip-text">Padmaisha</span>
            </Link>
            <button 
              className="relative p-2.5 rounded-xl bg-white hover:bg-gray-50 transition-all duration-300 text-gray-700 shadow-md group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div className="relative w-6 h-6">
                <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-current transition-all duration-300 -rotate-45"></span>
                <span className="absolute top-1/2 left-0 w-6 h-0.5 bg-current transition-all duration-300 rotate-45"></span>
              </div>
            </button>
          </div>
          <div className="flex flex-col w-full h-[calc(100vh-72px)] overflow-y-auto">
            {/* Search Section */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-pink-50">
              <div className="relative">
                <input
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg bg-white/80 backdrop-blur placeholder-gray-400 text-base"
                  placeholder="Search products..."
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            {/* User Section */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-pink-500 flex items-center justify-center text-white">
                  <FaUserCircle size={28} />
                </div>
                <div>
                  <div className="font-bold text-gray-900">{user ? user.displayName || user.email : 'Welcome, Guest'}</div>
                  <div className="text-sm text-gray-500">To access account and manage orders</div>
                </div>
              </div>
              {!user ? (
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Sign In / Sign Up
                  </button>
                </Link>
              ) : (
                <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-300" 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                  Sign Out
                </button>
              )}
            </div>

            {/* Navigation Links */}
            <div className="p-4 flex-1">
              <div className="space-y-4">
                {/* Main Navigation */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Menu</div>
                  <nav className="grid grid-cols-2 gap-2">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition-all">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">Home</span>
                    </Link>
                    <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-pink-50 transition-all">
                      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium">Products</span>
                    </Link>
                    <Link href="/brands" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-blue-50 transition-all">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Brands</span>
                    </Link>
                    <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 p-3 rounded-xl hover:bg-pink-50 transition-all">
                      <svg className="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Contact</span>
                    </Link>
                  </nav>
                </div>

                {/* User Links */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">Your Account</div>
                  <nav className="space-y-1">
                    <Link href="/profile/orders" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium text-gray-700">Orders</span>
                    </Link>
                    <Link href="/profile/wishlist" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium text-gray-700">Wishlist</span>
                    </Link>
                    <Link href="#" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                      </svg>
                      <span className="font-medium text-gray-700">Gift Cards</span>
                    </Link>
                  </nav>
                </div>

                {/* Admin Section */}
                {isAdmin && (
                  <div className="mt-6">
                    <Link href="/admin/login" onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;