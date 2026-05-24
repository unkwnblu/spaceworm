"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatNGN } from "@/lib/database.types";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice, getKey } =
    useCart();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={closeCart}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-6">
          <span className="text-xs font-black uppercase tracking-[0.25em]">
            Cart ({totalItems})
          </span>
          <button onClick={closeCart} aria-label="Close cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="text-xs font-black uppercase tracking-widest underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-100">
              {items.map((item) => {
                const key = getKey(item);
                const unit = item.product.price + (item.customization?.cost ?? 0);
                return (
                  <li key={key} className="flex gap-4 p-4">
                    {/* Thumbnail */}
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-zinc-100">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-bold uppercase tracking-wide hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {item.size} / {item.color}
                        </p>

                        {/* Customization details */}
                        {item.customization && (
                          <div className="mt-1.5 border-l-2 border-black pl-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-black">
                              Customized
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
                              {item.customization.name && (
                                <span>“{item.customization.name}”</span>
                              )}
                              {item.customization.number && (
                                <span>#{item.customization.number}</span>
                              )}
                              {item.customization.imageUrl && (
                                <span>· Image attached</span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[10px] text-zinc-400">
                              +{formatNGN(item.customization.cost)} customization
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-zinc-200">
                          <button
                            className="flex h-7 w-7 items-center justify-center text-sm hover:bg-zinc-50"
                            onClick={() => updateQuantity(key, item.quantity - 1)}
                          >
                            −
                          </button>
                          <span className="flex h-7 w-8 items-center justify-center text-xs font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            className="flex h-7 w-7 items-center justify-center text-sm hover:bg-zinc-50"
                            onClick={() => updateQuantity(key, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold">
                            {formatNGN(unit * item.quantity)}
                          </p>
                          <button
                            onClick={() => removeItem(key)}
                            className="text-[10px] uppercase tracking-wider text-zinc-400 hover:text-black"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-200 p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Subtotal
              </span>
              <span className="text-sm font-black">{formatNGN(totalPrice)}</span>
            </div>
            <p className="mb-4 text-[10px] text-zinc-400">
              Shipping calculated at checkout.
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-black py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
