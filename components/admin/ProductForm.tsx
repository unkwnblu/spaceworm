"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { DBProduct, ProductColor } from "@/lib/database.types";
import AdminFormField from "@/components/admin/AdminFormField";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import { uploadFile } from "@/lib/upload";

type Props = {
  initialData?: DBProduct;
  mode?: "create" | "edit";
  dangerZone?: React.ReactNode;
};

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";
const selectClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";

export default function ProductForm({ initialData, mode = "edit", dangerZone }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [category, setCategory] = useState(initialData?.category ?? "Tops");
  const [gender, setGender] = useState(initialData?.gender ?? "Unisex");
  // DB stores price in NGN directly — no × 1500
  const [price, setPrice] = useState(
    initialData?.price != null ? String(initialData.price) : ""
  );
  const [sizes, setSizes] = useState(initialData?.sizes.join(", ") ?? "");
  const [tag, setTag] = useState(initialData?.tag ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [colors, setColors] = useState<ProductColor[]>(
    (initialData?.colors as ProductColor[]) ?? []
  );
  const [images, setImages] = useState<string[]>(initialData?.images ?? []);
  const [customizable, setCustomizable] = useState<boolean>(initialData?.customizable ?? false);
  const [customizationCost, setCustomizationCost] = useState<string>(
    initialData?.customization_cost != null ? String(initialData.customization_cost) : ""
  );
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number }>({ done: 0, total: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  function markDirty() { setIsDirty(true); }

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0)
      errs.price = "Price must be greater than 0";
    if (!sizes.trim()) errs.sizes = "At least one size is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setErrors({});
    setSaving(true);
    setSaveError("");

    const payload = {
      name: name.trim(),
      price: Math.round(parseFloat(price)),
      category,
      gender,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors,
      description: description.trim() || null,
      tag: tag || null,
      images,
      customizable,
      customization_cost: customizable ? Math.round(parseFloat(customizationCost) || 0) : 0,
    };

    try {
      const url = mode === "create"
        ? "/api/admin/products"
        : `/api/admin/products/${initialData!.id}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) { setSaveError(data.error ?? "Save failed."); return; }

      setIsDirty(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);

      if (mode === "create") {
        router.push(`/admin/products/${data.id}`);
      } else {
        router.refresh();
      }
    } catch {
      setSaveError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function handleDiscard() {
    setName(initialData?.name ?? "");
    setCategory(initialData?.category ?? "Tops");
    setGender(initialData?.gender ?? "Unisex");
    setPrice(initialData?.price != null ? String(initialData.price) : "");
    setSizes(initialData?.sizes.join(", ") ?? "");
    setTag(initialData?.tag ?? "");
    setDescription(initialData?.description ?? "");
    setColors((initialData?.colors as ProductColor[]) ?? []);
    setImages(initialData?.images ?? []);
    setCustomizable(initialData?.customizable ?? false);
    setCustomizationCost(initialData?.customization_cost != null ? String(initialData.customization_cost) : "");
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
                  onChange={(e) => { setName(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              {mode === "edit" && initialData && (
                <AdminFormField label="Slug" hint="Auto-generated from name on create">
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
                    onChange={(e) => { setCategory(e.target.value); markDirty(); }}
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
                    onChange={(e) => { setGender(e.target.value); markDirty(); }}
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
                    onChange={(e) => { setPrice(e.target.value); markDirty(); }}
                    min={0}
                  />
                </AdminFormField>

                <AdminFormField label="Tag">
                  <select
                    className={selectClass}
                    value={tag}
                    onChange={(e) => { setTag(e.target.value); markDirty(); }}
                  >
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Limited">Limited</option>
                  </select>
                </AdminFormField>
              </div>

              <AdminFormField label="Sizes" hint="Comma-separated, e.g. XS, S, M, L, XL" error={errors.sizes}>
                <input
                  className={inputClass}
                  value={sizes}
                  onChange={(e) => { setSizes(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <AdminFormField label="Description">
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={4}
                  value={description}
                  onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              {/* Customization toggle */}
              <div className="border border-zinc-200 bg-zinc-50 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={customizable}
                    onChange={(e) => { setCustomizable(e.target.checked); markDirty(); }}
                    className="mt-0.5 h-4 w-4 accent-black"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-widest text-black">
                      Allow Customization
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Customers can add a name, number, and image to this product for an additional fee.
                    </p>
                  </div>
                </label>

                {customizable && (
                  <div className="mt-4 pl-7">
                    <AdminFormField label="Additional Cost (NGN)" hint="Flat fee added per customized item">
                      <input
                        type="number"
                        className={inputClass}
                        value={customizationCost}
                        onChange={(e) => { setCustomizationCost(e.target.value); markDirty(); }}
                        min={0}
                        placeholder="0"
                      />
                    </AdminFormField>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Colors */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Colors</h2>
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
              Images ({images.length})
            </h2>
            <div className="flex flex-col gap-3">
              {images.map((url, i) => (
                <div key={i} className="group flex items-center gap-3">
                  <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden border border-zinc-200 bg-zinc-50">
                    <Image src={url} alt="" fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <p className="truncate text-[10px] text-zinc-400">{url.split("/").pop()}</p>
                    <div className="flex items-center gap-2">
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => {
                              const next = [...prev];
                              [next[i - 1], next[i]] = [next[i], next[i - 1]];
                              return next;
                            });
                            markDirty();
                          }}
                          className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black"
                        >
                          ↑
                        </button>
                      )}
                      {i < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => {
                              const next = [...prev];
                              [next[i], next[i + 1]] = [next[i + 1], next[i]];
                              return next;
                            });
                            markDirty();
                          }}
                          className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImages((prev) => prev.filter((_, j) => j !== i));
                          markDirty();
                        }}
                        className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              multiple
              className="hidden"
              onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                if (files.length === 0) return;
                setUploading(true);
                setUploadProgress({ done: 0, total: files.length });

                for (let i = 0; i < files.length; i++) {
                  try {
                    const result = await uploadFile(files[i], "product-images");
                    setImages((prev) => [...prev, result.url]);
                    markDirty();
                  } catch {
                    // skip failed uploads
                  }
                  setUploadProgress({ done: i + 1, total: files.length });
                }

                setUploading(false);
                setUploadProgress({ done: 0, total: 0 });
                e.target.value = "";
              }}
            />

            {/* Upload progress bar */}
            {uploading && uploadProgress.total > 0 && (
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                    Uploading {uploadProgress.done}/{uploadProgress.total}
                  </span>
                  <span className="text-[10px] font-bold text-black">
                    {Math.round((uploadProgress.done / uploadProgress.total) * 100)}%
                  </span>
                </div>
                <div className="h-1 w-full overflow-hidden bg-zinc-200">
                  <div
                    className="h-full bg-black transition-all duration-300"
                    style={{ width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="mt-3 w-full border border-dashed border-zinc-300 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-black hover:text-black disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "+ Add Images"}
            </button>
          </div>
        </div>
      </div>

      {dangerZone && <div className="mt-10">{dangerZone}</div>}

      {saveError && (
        <p className="mt-4 text-[10px] font-semibold text-red-500">{saveError}</p>
      )}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 z-10 -mx-6 mt-8 border-t border-zinc-200 bg-white px-6 py-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {saving ? "Saving…" : mode === "create" ? "Create Product" : "Save Changes"}
          </button>
          {isDirty && !saving && (
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
