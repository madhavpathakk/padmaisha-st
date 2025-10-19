import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import CartBadge from "./CartBadge";
import WishlistBadge from "./WishlistBadge";

export default function Navbar() {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const location = useLocation();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white bg-opacity-10 shadow-lg">
      <Link to="/" className="text-2xl font-bold text-blue-400">Padmaisha</Link>
      <div className="flex items-center gap-6">
        <Link to="/products" className="hover:text-red-400">Products</Link>
        <Link to="/profile/wishlist" aria-label="Wishlist" className="relative">
          <WishlistBadge count={wishlist.length} />
        </Link>
        <Link to="/cart" aria-label="Cart" className="relative">
          <CartBadge count={cart.reduce((a, b) => a + b.quantity, 0)} />
        </Link>
        <Link to="/profile" className="hover:text-blue-300">Profile</Link>
      </div>
    </nav>
  );
}
