"use client";

import { useRef, useState } from "react";
import { uploadFile } from "@/lib/upload";

type Props = {
  value: string;
  onChange: (url: string) => void;
  bucket?: "event-images" | "product-images" | "drop-images";
  aspect?: string; // e.g. "16/9", "4/5", "1/1"
};

export default function ImageUploader({
  value,
  onChange,
  bucket = "event-images",
  aspect = "16/9",
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  async function upload(file: File) {
    setError("");
    setUploading(true);
    try {
      const result = await uploadFile(file, bucket);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) upload(file);
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {value ? (
        <div className="relative inline-block max-w-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Uploaded preview"
            style={{ aspectRatio: aspect }}
            className="w-full max-w-md border border-zinc-200 object-cover"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="border border-zinc-300 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-black transition-colors hover:bg-zinc-50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          disabled={uploading}
          style={{ aspectRatio: aspect }}
          className={`flex w-full max-w-md flex-col items-center justify-center border-2 border-dashed transition-colors ${
            dragging
              ? "border-black bg-zinc-50"
              : "border-zinc-300 bg-white hover:border-zinc-500 hover:bg-zinc-50"
          } ${uploading ? "opacity-60" : ""}`}
        >
          {uploading ? (
            <>
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-black" />
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Uploading…
              </p>
            </>
          ) : (
            <>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-black">
                Click or drag to upload
              </p>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                JPG · PNG · WebP · max 20 MB
              </p>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-3 text-[10px] font-semibold text-red-500">{error}</p>
      )}
    </div>
  );
}
