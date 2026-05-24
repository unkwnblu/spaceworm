"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { DBProduct, Customization } from "@/lib/database.types";

export type CartItem = {
  product: DBProduct;
  size: string;
  color: string;
  quantity: number;
  customization?: Customization | null;
};

// Stable key per cart line — customised items get unique keys so they don't
// merge with non-customised lines.
function itemKey(productId: string, size: string, color: string, c?: Customization | null) {
  if (!c) return `${productId}|${size}|${color}|plain`;
  return `${productId}|${size}|${color}|${c.name}|${c.number}|${c.imageUrl}`;
}

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: DBProduct, size: string, color: string, customization?: Customization | null) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  getKey: (item: CartItem) => string;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | null>(null);

function lineTotal(item: CartItem): number {
  const base = item.product.price;
  const custom = item.customization?.cost ?? 0;
  return (base + custom) * item.quantity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    (product: DBProduct, size: string, color: string, customization?: Customization | null) => {
      setItems((prev) => {
        const key = itemKey(product.id, size, color, customization);
        const existing = prev.find(
          (i) => itemKey(i.product.id, i.size, i.color, i.customization) === key
        );
        if (existing) {
          return prev.map((i) =>
            itemKey(i.product.id, i.size, i.color, i.customization) === key
              ? { ...i, quantity: i.quantity + 1 }
              : i
          );
        }
        return [...prev, { product, size, color, quantity: 1, customization: customization ?? null }];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => itemKey(i.product.id, i.size, i.color, i.customization) !== key
      )
    );
  }, []);

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) =>
        prev.filter(
          (i) => itemKey(i.product.id, i.size, i.color, i.customization) !== key
        )
      );
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.product.id, i.size, i.color, i.customization) === key
          ? { ...i, quantity }
          : i
      )
    );
  }, []);

  const getKey = useCallback(
    (item: CartItem) => itemKey(item.product.id, item.size, item.color, item.customization),
    []
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + lineTotal(i), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        getKey,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
