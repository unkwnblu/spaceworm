"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product, Gender } from "@/lib/mockData";
import AdminFormField from "@/components/admin/AdminFormField";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";

type Props = {
  initialData?: Product;
  mode?: "create" | "edit";
  dangerZone?: React.ReactNode;
};

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";
const selectClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";

export default function ProductForm({ initialData, mode = "edit", dangerZone }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Tops");
  const [gender, setGender] = useState<Gender>(initialData?.gender ?? "Unisex");
  const [price, setPrice] = useState(
    initialData?.price != null ? String(initialData.price * 1500) : ""
  );
  const [sizes, setSizes] = useState(initialData?.sizes.join(", ") ?? "");
  const [tag, setTag] = useState(initialData?.tag ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [colors, setColors] = useState<{ name: string; hex: string }[]>(
    initialData?.colors ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  function markDirty() {
    setIsDirty(true);
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0)
      errs.price = "Price must be greater than 0";
    if (!sizes.trim()) errs.sizes = "At least one size is required";
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleDiscard() {
    setName(initialData?.name ?? "");
    setCategory(initialData?.category ?? "Tops");
    setGender(initialData?.gender ?? "Unisex");
    setPrice(initialData?.price != null ? String(initialData.price * 1500) : "");
    setSizes(initialData?.sizes.join(", ") ?? "");
    setTag(initialData?.tag ?? "");
    setDescription(initialData?.description ?? "");
    setColors(initialData?.colors ?? []);
    setErrors({});
    setIsDirty(false);
  }

  function addColor() {
    setColors((prev) => [...prev, { name: "", hex: "#000000" }]);
    markDirty();
  }

  function updateColor(index: number, field: "name" | "hex", value: string) {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
    markDirty();
  }

  function removeColor(index: number) {
    setColors((prev) => prev.filter((_, i) => i !== index));
    markDirty();
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        {/* Main form */}
        <form id="product-form" onSubmit={handleSubmit}>
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Details
            </h2>
            <div className="flex flex-col gap-5">
              <AdminFormField label="Name" error={errors.name}>
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    markDirty();
                  }}
                />
              </AdminFormField>

              {mode === "edit" && initialData && (
                <AdminFormField
                  label="Slug"
                  hint="URL path — updates automatically when connected to backend"
                >
                  <input
                    className={`${inputClass} bg-zinc-50 text-zinc-400`}
                    value={initialData.slug}
                    readOnly
                  />
                </AdminFormField>
              )}

              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Category">
                  <select
                    className={selectClass}
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      markDirty();
                    }}
                  >
                    {["Tops", "Bottoms", "Outerwear", "Accessories"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </AdminFormField>

                <AdminFormField label="Gender">
                  <select
                    className={selectClass}
                    value={gender}
                    onChange={(e) => {
                      setGender(e.target.value as Gender);
                      markDirty();
                    }}
                  >
                    {["Men", "Women", "Unisex"].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </AdminFormField>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Price (NGN)" error={errors.price}>
                  <input
                    type="number"
                    className={inputClass}
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      markDirty();
                    }}
                    min={0}
                  />
                </AdminFormField>

                <AdminFormField label="Tag">
                  <select
                    className={selectClass}
                    value={tag}
                    onChange={(e) => {
                      setTag(e.target.value);
                      markDirty();
                    }}
                  >
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Limited">Limited</option>
                  </select>
                </AdminFormField>
              </div>

              <AdminFormField
                label="Sizes"
                hint="Comma-separated, e.g. XS, S, M, L, XL"
                error={errors.sizes}
              >
                <input
                  className={inputClass}
                  value={sizes}
                  onChange={(e) => {
                    setSizes(e.target.value);
                    markDirty();
                  }}
                />
              </AdminFormField>

              <AdminFormField label="Description">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    markDirty();
                  }}
                />
              </AdminFormField>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Colors */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Colors
            </h2>
            <div className="flex flex-col gap-3">
              {colors.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(i, "hex", e.target.value)}
                    className="h-8 w-8 flex-shrink-0 cursor-pointer border border-zinc-200 bg-white p-0.5"
                  />
                  <input
                    className="flex-1 border border-zinc-200 px-2 py-1.5 text-xs text-black outline-none focus:border-black transition-colors"
                    placeholder="Color name"
                    value={c.name}
                    onChange={(e) => updateColor(i, "name", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="flex-shrink-0 text-base leading-none text-zinc-400 transition-colors hover:text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColor}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
            >
              + Add Color
            </button>
          </div>

          {/* Images */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Images
            </h2>
            {initialData?.images && initialData.images.length > 0 ? (
              <div className="flex flex-col gap-3">
                {initialData.images.map((url, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden border border-zinc-200 bg-zinc-50">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <p className="truncate text-[10px] text-zinc-400">{url}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-400">No images yet.</p>
            )}
            <p className="mt-4 text-[10px] text-zinc-400">
              Image upload available when backend is connected.
            </p>
          </div>
        </div>
      </div>

      {/* Danger zone slot */}
      {dangerZone && <div className="mt-10">{dangerZone}</div>}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-zinc-200 bg-white px-6 py-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="product-form"
            className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
          >
            {mode === "create" ? "Create Product" : "Save Changes"}
          </button>
          {isDirty && (
            <>
              <button
                type="button"
                onClick={handleDiscard}
                className="text-xs font-semibold uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
              >
                Discard
              </button>
              <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-zinc-400 sm:inline">
                Unsaved changes
              </span>
            </>
          )}
        </div>
      </div>

      <AdminSaveToast visible={saved} />
    </>
  );
}
