"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { LineItem } from "@/lib/pricing";

export const CART_STORAGE_KEY = "gs_cart_v1";

interface CartContextValue {
  items: LineItem[];
  count: number;
  hydrated: boolean;
  lastAdded: LineItem | null;
  drawerOpen: boolean;
  add: (item: Omit<LineItem, "quantity">, quantity?: number) => void;
  setQuantity: (productId: string, color: string, quantity: number) => void;
  remove: (productId: string, color: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): LineItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as LineItem[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<LineItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState<LineItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((item: Omit<LineItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === item.productId && i.color === item.color);
      if (idx === -1) return [...prev, { ...item, quantity }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + quantity };
      return next;
    });
    setLastAdded({ ...item, quantity });
    setDrawerOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, color: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.productId === productId && i.color === color ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const remove = useCallback((productId: string, color: string) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.color === color)));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      hydrated,
      lastAdded,
      drawerOpen,
      add,
      setQuantity,
      remove,
      clear,
      openDrawer,
      closeDrawer,
    }),
    [items, hydrated, lastAdded, drawerOpen, add, setQuantity, remove, clear, openDrawer, closeDrawer],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
