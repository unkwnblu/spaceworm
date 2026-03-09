"use client";

import { useState } from "react";
import { Product, toNGN } from "@/lib/mockData";
import { useCart } from "@/context/CartContext";
import ProductGallery from "@/components/ProductGallery";
import SizeSelector from "@/components/SizeSelector";
import ColorSelector from "@/components/ColorSelector";

type Props = {
  product: Product;
};

export default function PDPClient({ product }: Props) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[55fr_45fr]">
      {/* Left — Gallery */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* Right — Details */}
      <div className="flex flex-col justify-center px-8 py-16 md:px-12 md:py-24 lg:px-16">
        {/* Breadcrumb */}
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
          {product.category}
          {product.tag && (
            <span className="ml-3 bg-black px-1.5 py-0.5 text-white">{product.tag}</span>
          )}
        </p>

        {/* Name */}
        <h1 className="mb-2 text-3xl font-black uppercase leading-none tracking-tight text-black md:text-4xl">
          {product.name}
        </h1>

        {/* Price */}
        <p className="mb-8 text-xl font-black text-black">{toNGN(product.price)}</p>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-zinc-100" />

        {/* Color */}
        <div className="mb-6">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
            Color — <span className="text-black">{selectedColor}</span>
          </p>
          <ColorSelector
            colors={product.colors}
            selected={selectedColor}
            onChange={setSelectedColor}
          />
        </div>

        {/* Size */}
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              Size — <span className="text-black">{selectedSize}</span>
            </p>
            <button className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 underline hover:text-black">
              Size Guide
            </button>
          </div>
          <SizeSelector
            sizes={product.sizes}
            selected={selectedSize}
            onChange={setSelectedSize}
          />
        </div>

        {/* Add to Cart */}
        {/* TODO: Integrate Paystack on checkout */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-5 text-xs font-black uppercase tracking-[0.3em] transition-colors ${
            added
              ? "bg-zinc-800 text-white"
              : "bg-black text-white hover:bg-zinc-800"
          }`}
        >
          {added ? "Added to Cart ✓" : "Add to Cart"}
        </button>

        {/* Divider */}
        <div className="my-8 h-px w-full bg-zinc-100" />

        {/* Description */}
        <p className="text-sm leading-relaxed text-zinc-600">{product.description}</p>

        {/* Details accordion placeholder */}
        <div className="mt-8 border-t border-zinc-100">
          {["Material & Care", "Shipping & Returns"].map((label) => (
            <div key={label} className="border-b border-zinc-100 py-4">
              <button className="flex w-full items-center justify-between text-xs font-black uppercase tracking-widest text-black">
                {label}
                <span className="text-zinc-400">+</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
