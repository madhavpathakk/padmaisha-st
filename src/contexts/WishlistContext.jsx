import React, { createContext, useReducer, useEffect, useContext } from "react";

const WishlistContext = createContext();

const initialState = JSON.parse(localStorage.getItem("wishlist")) || [];

function wishlistReducer(state, action) {
  switch (action.type) {
    case "ADD":
      if (state.find(item => item.id === action.item.id)) return state;
      return [...state, action.item];
    case "REMOVE":
      return state.filter(item => item.id !== action.id);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, dispatch] = useReducer(wishlistReducer, initialState);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  return (
    <WishlistContext.Provider value={{ wishlist, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
