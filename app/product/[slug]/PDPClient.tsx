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
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  function handleAddToCart() {
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pt-20 pb-16 md:px-8 md:pt-24">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[55fr_45fr] md:gap-16">
      {/* Left — Gallery */}
      <div>
        <ProductGallery images={product.images} productName={product.name} />
      </div>

      {/* Right — Details */}
      <div className="flex flex-col justify-start py-2">
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
            <button
              onClick={() => setSizeGuideOpen(true)}
              className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 underline hover:text-black"
            >
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

        {/* Details accordion */}
        <div className="mt-8 border-t border-zinc-100">
          {[
            {
              label: "Material & Care",
              content:
                "Constructed from premium heavyweight fabric. Machine wash cold, hang dry. Do not bleach. Iron on low heat if needed. Detailed composition varies by colorway — refer to garment label.",
            },
            {
              label: "Shipping & Returns",
              content:
                "Free shipping on all orders over ₦150,000. Standard delivery 3–5 business days within Nigeria, 7–14 days international. Returns accepted within 14 days of delivery — items must be unworn with tags attached.",
            },
          ].map((section) => (
            <div key={section.label} className="border-b border-zinc-100">
              <button
                onClick={() =>
                  setOpenSection(openSection === section.label ? null : section.label)
                }
                className="flex w-full items-center justify-between py-4 text-xs font-black uppercase tracking-widest text-black"
              >
                {section.label}
                <span className="text-zinc-400">
                  {openSection === section.label ? "−" : "+"}
                </span>
              </button>
              {openSection === section.label && (
                <p className="pb-4 text-sm leading-relaxed text-zinc-500">
                  {section.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setSizeGuideOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.25em]">
                  Size Guide
                </h2>
                <button
                  onClick={() => setSizeGuideOpen(false)}
                  aria-label="Close size guide"
                >
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
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                Measurements in centimeters
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      {["Size", "Chest", "Waist", "Hips", "Length"].map((h) => (
                        <th
                          key={h}
                          className="py-2 pr-4 font-black uppercase tracking-widest text-black"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-zinc-500">
                    {[
                      ["XS", "86", "70", "90", "66"],
                      ["S", "92", "76", "96", "68"],
                      ["M", "98", "82", "102", "70"],
                      ["L", "104", "88", "108", "72"],
                      ["XL", "110", "94", "114", "74"],
                      ["XXL", "116", "100", "120", "76"],
                    ].map((row) => (
                      <tr key={row[0]} className="border-b border-zinc-100">
                        {row.map((cell, i) => (
                          <td
                            key={i}
                            className={`py-2 pr-4 ${i === 0 ? "font-bold text-black" : ""}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
