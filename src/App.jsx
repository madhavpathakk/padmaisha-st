import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import Navbar from "./components/Navbar";
import ProductsPage from "./pages/ProductsPage";
import WishlistPage from "./pages/WishlistPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <Navbar />
            <Routes>
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/profile/wishlist" element={<WishlistPage />} />
              <Route path="/" element={<ProductsPage />} />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </WishlistProvider>
    </CartProvider>
  );
}

export default App;
