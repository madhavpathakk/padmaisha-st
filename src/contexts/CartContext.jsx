import React, { createContext, useReducer, useEffect, useContext } from "react";

const CartContext = createContext();

const initialState = JSON.parse(localStorage.getItem("cart")) || [];

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const exists = state.find(item => item.id === action.item.id);
      if (exists) {
        return state.map(item =>
          item.id === action.item.id
            ? { ...item, quantity: item.quantity + action.item.quantity }
            : item
        );
      }
      return [...state, { ...action.item, quantity: action.item.quantity }];
    case "REMOVE":
      return state.filter(item => item.id !== action.id);
    case "UPDATE":
      return state.map(item =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
