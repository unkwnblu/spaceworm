import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import type { DBProduct } from "@/lib/database.types";

const mockProduct: DBProduct = {
  id: "prod-1",
  slug: "test-tee",
  name: "Test Tee",
  price: 15000,
  images: ["/img.jpg"],
  sizes: ["S", "M", "L"],
  colors: [{ name: "Black", hex: "#000" }],
  description: "A test product",
  category: "T-Shirts",
  gender: "Unisex",
  tag: null,
  customizable: false,
  customization_cost: 0,
  allow_custom_name: true,
  allow_custom_number: true,
  allow_custom_image: true,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
};

const mockProduct2: DBProduct = {
  ...mockProduct,
  id: "prod-2",
  slug: "test-hoodie",
  name: "Test Hoodie",
  price: 35000,
};

function setup() {
  return renderHook(() => useCart(), { wrapper: CartProvider });
}

describe("CartContext", () => {
  it("starts with empty cart", () => {
    const { result } = setup();
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.isOpen).toBe(false);
  });

  it("adds an item and opens cart", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalItems).toBe(1);
    expect(result.current.totalPrice).toBe(15000);
    expect(result.current.isOpen).toBe(true);
  });

  it("increments quantity for duplicate item", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(30000);
  });

  it("treats different sizes as separate items", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "S", "Black"));
    act(() => result.current.addItem(mockProduct, "L", "Black"));
    expect(result.current.items).toHaveLength(2);
    expect(result.current.totalItems).toBe(2);
  });

  it("removes an item", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    act(() => result.current.addItem(mockProduct2, "L", "Black"));
    expect(result.current.items).toHaveLength(2);

    const key = result.current.getKey(result.current.items[0]);
    act(() => result.current.removeItem(key));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe("prod-2");
  });

  it("updates quantity", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    const key = result.current.getKey(result.current.items[0]);
    act(() => result.current.updateQuantity(key, 5));
    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalItems).toBe(5);
  });

  it("removes item when quantity set to 0", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    const key = result.current.getKey(result.current.items[0]);
    act(() => result.current.updateQuantity(key, 0));
    expect(result.current.items).toHaveLength(0);
  });

  it("opens and closes cart", () => {
    const { result } = setup();
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.openCart());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.closeCart());
    expect(result.current.isOpen).toBe(false);
  });

  it("calculates total price across multiple products", () => {
    const { result } = setup();
    act(() => result.current.addItem(mockProduct, "M", "Black"));
    act(() => result.current.addItem(mockProduct2, "L", "Black"));
    expect(result.current.totalPrice).toBe(50000);
  });
});
