import React, { useState } from "react";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import WishlistCard from "../components/WishlistCard";
import WishlistEmpty from "../components/WishlistEmpty";
import RequestQuoteModal from "../components/RequestQuoteModal";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();
  const [quoteItem, setQuoteItem] = useState(null);

  if (wishlist.length === 0) return <WishlistEmpty />;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {wishlist.map(item => (
          <WishlistCard
            key={item.id}
            item={item}
            onAddToCart={quantity => {
              cartDispatch({ type: "ADD", item: { ...item, quantity } });
              toast.success(`Added ${quantity} x ${item.name} to cart!`);
            }}
            onRequestQuote={() => setQuoteItem(item)}
            onShare={() => {
              try {
                if (navigator.share) {
                  navigator.share({
                    title: item.name,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard!");
                }
              } catch {
                toast.error("Unable to share.");
              }
            }}
            onRemove={() => {
              if (window.confirm("Remove this item from wishlist?")) {
                wishlistDispatch({ type: "REMOVE", id: item.id });
                toast.success("Removed from wishlist!");
              }
            }}
          />
        ))}
      </div>
      {quoteItem && (
        <RequestQuoteModal
          item={quoteItem}
          onClose={() => setQuoteItem(null)}
        />
      )}
    </div>
  );
}
