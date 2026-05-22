"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  url: string;
  redirectTo: string;
  label: string;
};

export default function DeleteButton({ url, redirectTo, label }: Props) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Delete failed.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-xs text-zinc-500">Are you sure? This cannot be undone.</p>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
        >
          {deleting ? "Deleting…" : "Confirm Delete"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
        >
          Cancel
        </button>
        {error && <p className="text-[10px] font-semibold text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="border border-red-200 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-red-400 transition-colors hover:border-red-400 hover:text-red-600"
    >
      {label}
    </button>
  );
}
