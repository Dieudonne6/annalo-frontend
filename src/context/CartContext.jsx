import { createContext, useCallback, useContext, useEffect, useState } from "react";

import * as cartApi from "../api/subscriptions";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], total: 0 });
      return;
    }
    const { data } = await cartApi.fetchCart();
    setCart(data);
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function addItem(paperId) {
    await cartApi.addToCart(paperId);
    await refresh();
    setIsDrawerOpen(true);
  }

  async function removeItem(itemId) {
    await cartApi.removeFromCart(itemId);
    await refresh();
  }

  const value = {
    cart,
    count: cart.items.length,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    addItem,
    removeItem,
    refresh,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart doit être utilisé dans <CartProvider>");
  return ctx;
}
