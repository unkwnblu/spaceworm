"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { DBDrop, DBProduct } from "@/lib/database.types";
import AdminFormField from "@/components/admin/AdminFormField";
import AdminSaveToast from "@/components/admin/AdminSaveToast";
import { useUnsavedChanges } from "@/lib/useUnsavedChanges";
import { uploadFile } from "@/lib/upload";

type Props = {
  initialData?: DBDrop;
  initialProductIds?: string[];
  allProducts: DBProduct[];
  mode?: "create" | "edit";
  dangerZone?: React.ReactNode;
};

const inputClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";
const selectClass =
  "w-full border border-zinc-300 bg-white px-3 py-2.5 text-sm text-black outline-none focus:border-black transition-colors";

export default function DropForm({
  initialData,
  initialProductIds = [],
  allProducts,
  mode = "edit",
  dangerZone,
}: Props) {
  const router = useRouter();

  const [number, setNumber] = useState(initialData?.number ?? "");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [date, setDate] = useState(initialData?.date ?? "");
  const [status, setStatus] = useState(initialData?.status ?? "upcoming");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.image_url ?? "");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(initialProductIds);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChanges(isDirty);

  function markDirty() { setIsDirty(true); }

  function toggleProduct(productId: string) {
    setSelectedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
    markDirty();
  }

  function validate() {
    const errs: Record<string, string> = {};
    if (!number.trim()) errs.number = "Drop number is required";
    if (!title.trim()) errs.title = "Title is required";
    if (!date) errs.date = "Date is required";
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
      number: number.trim(),
      title: title.trim(),
      date,
      status,
      description: description.trim() || null,
      image_url: imageUrl || null,
      productIds: selectedProductIds,
    };

    try {
      const url = mode === "create"
        ? "/api/admin/drops"
        : `/api/admin/drops/${initialData!.id}`;
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
        router.push(`/admin/drops/${data.id}`);
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
    setNumber(initialData?.number ?? "");
    setTitle(initialData?.title ?? "");
    setDate(initialData?.date ?? "");
    setStatus(initialData?.status ?? "upcoming");
    setDescription(initialData?.description ?? "");
    setImageUrl(initialData?.image_url ?? "");
    setSelectedProductIds(initialProductIds);
    setErrors({});
    setIsDirty(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <form id="drop-form" onSubmit={handleSubmit}>
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Drop Details
            </h2>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-4">
                <AdminFormField label="Drop Number" hint="e.g. 003" error={errors.number}>
                  <input
                    className={inputClass}
                    value={number}
                    onChange={(e) => { setNumber(e.target.value); markDirty(); }}
                  />
                </AdminFormField>

                <AdminFormField label="Status">
                  <select
                    className={selectClass}
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); markDirty(); }}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </AdminFormField>
              </div>

              <AdminFormField label="Title" error={errors.title}>
                <input
                  className={inputClass}
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); markDirty(); }}
                />
              </AdminFormField>

              <AdminFormField label="Drop Date" error={errors.date}>
                <input
                  type="date"
                  className={inputClass}
                  value={date}
                  onChange={(e) => { setDate(e.target.value); markDirty(); }}
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
            </div>
          </div>
        </form>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Drop Image */}
          <div className="border border-zinc-200 bg-white p-6">
            <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Drop Image
            </h2>
            {imageUrl ? (
              <div className="group relative">
                <div className="relative aspect-[3/4] w-full overflow-hidden border border-zinc-200 bg-zinc-50">
                  <Image src={imageUrl} alt="" fill className="object-cover" sizes="300px" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploading}
                    className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-black"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageUrl(""); markDirty(); }}
                    className="text-[9px] font-bold uppercase tracking-widest text-zinc-300 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploading}
                className="w-full border border-dashed border-zinc-300 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:border-black hover:text-black disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "+ Upload Image"}
              </button>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const result = await uploadFile(file, "drop-images");
                  setImageUrl(result.url);
                  markDirty();
                } catch {
                  // skip failed upload
                }
                setUploading(false);
                e.target.value = "";
              }}
            />
          </div>

          {/* Products checklist */}
          <div className="border border-zinc-200 bg-white p-6">
          <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Products in Drop
          </h2>
          <div className="flex flex-col gap-3">
            {allProducts.map((p) => (
              <label key={p.id} className="flex cursor-pointer items-center gap-3 py-1">
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(p.id)}
                  onChange={() => toggleProduct(p.id)}
                  className="h-3.5 w-3.5 accent-black"
                />
                <div>
                  <p className="text-xs font-semibold text-black">{p.name}</p>
                  <p className="text-[10px] text-zinc-400">{p.category}</p>
                </div>
              </label>
            ))}
          </div>
          <p className="mt-4 text-[10px] text-zinc-400">
            {selectedProductIds.length} of {allProducts.length} selected
          </p>
        </div>
        </div>
      </div>

      {dangerZone && <div className="mt-10">{dangerZone}</div>}

      {saveError && (
        <p className="mt-4 text-[10px] font-semibold text-red-500">{saveError}</p>
      )}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 mt-8 border-t border-zinc-200 bg-white px-6 py-4 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
        <div className="flex items-center gap-4">
          <button
            type="submit"
            form="drop-form"
            disabled={saving}
            className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800 disabled:bg-zinc-400"
          >
            {saving ? "Saving…" : mode === "create" ? "Create Drop" : "Save Changes"}
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
