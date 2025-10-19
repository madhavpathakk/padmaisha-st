import React from "react";
import sampleProducts from "../sampleData";
import ProductCard from "../components/ProductCard";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            inWishlist={wishlist.some(item => item.id === product.id)}
            onAddToCart={() => {
              cartDispatch({ type: "ADD", item: { ...product, quantity: 1 } });
              toast.success(`Added ${product.name} to cart!`);
            }}
            onToggleWishlist={() => {
              if (wishlist.some(item => item.id === product.id)) {
                wishlistDispatch({ type: "REMOVE", id: product.id });
                toast.success("Removed from wishlist!");
              } else {
                wishlistDispatch({ type: "ADD", item: product });
                toast.success("Added to wishlist!");
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
