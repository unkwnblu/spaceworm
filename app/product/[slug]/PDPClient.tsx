"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { DBProduct, ProductColor, Customization } from "@/lib/database.types";
import { formatNGN } from "@/lib/database.types";
import { useCart } from "@/context/CartContext";
import ProductGallery from "@/components/ProductGallery";
import SizeSelector from "@/components/SizeSelector";
import ColorSelector from "@/components/ColorSelector";
import { uploadCustomizationFile } from "@/lib/upload";

type Props = {
  product: DBProduct;
};

export default function PDPClient({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const colors = (product.colors ?? []) as ProductColor[];
  const [selectedColor, setSelectedColor] = useState(colors[0]?.name ?? "");
  const [added, setAdded] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // Customization state
  const [customizeOn, setCustomizeOn] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customImageUrl, setCustomImageUrl] = useState("");
  const [uploadingCustom, setUploadingCustom] = useState(false);
  const [customError, setCustomError] = useState("");
  const customFileRef = useRef<HTMLInputElement>(null);

  const customizationCost = product.customization_cost ?? 0;
  const totalUnitPrice = product.price + (customizeOn ? customizationCost : 0);

  function buildCustomization(): Customization | null {
    if (!customizeOn) return null;
    if (!customName.trim() && !customNumber.trim() && !customImageUrl) return null;
    return {
      name: customName.trim(),
      number: customNumber.trim(),
      imageUrl: customImageUrl,
      cost: customizationCost,
    };
  }

  function handleAddToCart() {
    addItem(product, selectedSize, selectedColor, buildCustomization());
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBuyNow() {
    addItem(product, selectedSize, selectedColor, buildCustomization());
    router.push("/checkout");
  }

  async function handleCustomFile(file: File) {
    setCustomError("");
    setUploadingCustom(true);
    try {
      const result = await uploadCustomizationFile(file);
      setCustomImageUrl(result.url);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploadingCustom(false);
    }
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
        <p className="mb-8 text-xl font-black text-black">
          {formatNGN(totalUnitPrice)}
          {customizeOn && customizationCost > 0 && (
            <span className="ml-2 text-xs font-semibold text-zinc-400">
              ({formatNGN(product.price)} + {formatNGN(customizationCost)} custom)
            </span>
          )}
        </p>

        {/* Divider */}
        <div className="mb-8 h-px w-full bg-zinc-100" />

        {/* Color */}
        <div className="mb-6">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
            Color — <span className="text-black">{selectedColor}</span>
          </p>
          <ColorSelector
            colors={colors}
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

        {/* Customization */}
        {product.customizable && (product.allow_custom_name || product.allow_custom_number || product.allow_custom_image) && (
          <div className="mb-8 border border-zinc-200 bg-zinc-50">
            <label className="flex cursor-pointer items-start gap-3 p-4">
              <input
                type="checkbox"
                checked={customizeOn}
                onChange={(e) => setCustomizeOn(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-black"
              />
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-widest text-black">
                  Customize this piece
                </p>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Add a name, number, or upload your own image.
                  {customizationCost > 0 && (
                    <> Adds <span className="font-bold text-black">{formatNGN(customizationCost)}</span>.</>
                  )}
                </p>
              </div>
            </label>

            {customizeOn && (
              <div className="border-t border-zinc-200 bg-white p-4">
                <div className="flex flex-col gap-3">
                  {product.allow_custom_name && (
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        maxLength={20}
                        className="w-full border border-zinc-300 px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                        placeholder="e.g. SPACEWORM"
                      />
                    </div>
                  )}

                  {product.allow_custom_number && (
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Number
                      </label>
                      <input
                        type="text"
                        value={customNumber}
                        onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ""))}
                        maxLength={3}
                        className="w-full border border-zinc-300 px-3 py-2.5 text-sm text-black outline-none focus:border-black"
                        placeholder="e.g. 07"
                      />
                    </div>
                  )}

                  {product.allow_custom_image && (
                    <div>
                      <label className="mb-1.5 block text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        Image
                      </label>
                      <input
                        ref={customFileRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleCustomFile(f);
                          e.target.value = "";
                        }}
                      />
                      {customImageUrl ? (
                        <div className="flex items-center gap-3">
                          <div className="relative h-20 w-20 overflow-hidden border border-zinc-200 bg-zinc-50">
                            <Image src={customImageUrl} alt="Custom" fill className="object-cover" sizes="80px" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => customFileRef.current?.click()}
                              disabled={uploadingCustom}
                              className="text-[10px] font-black uppercase tracking-widest text-zinc-500 underline hover:text-black"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={() => setCustomImageUrl("")}
                              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => customFileRef.current?.click()}
                          disabled={uploadingCustom}
                          className="w-full border border-dashed border-zinc-300 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-black hover:text-black disabled:opacity-50"
                        >
                          {uploadingCustom ? "Uploading…" : "+ Upload Image"}
                        </button>
                      )}
                      {customError && (
                        <p className="mt-2 text-[10px] font-semibold text-red-500">{customError}</p>
                      )}
                    </div>
                  )}

                  <p className="mt-1 text-[10px] text-zinc-400">
                    Customization is final once your order is placed.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add to Cart + Buy Now */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAddToCart}
            disabled={uploadingCustom}
            className={`w-full py-5 text-xs font-black uppercase tracking-[0.3em] transition-colors disabled:opacity-50 ${
              added
                ? "bg-zinc-800 text-white"
                : "bg-black text-white hover:bg-zinc-800"
            }`}
          >
            {added ? "Added to Cart ✓" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={uploadingCustom}
            className="w-full border border-black py-5 text-xs font-black uppercase tracking-[0.3em] text-black transition-colors hover:bg-black hover:text-white disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>

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
