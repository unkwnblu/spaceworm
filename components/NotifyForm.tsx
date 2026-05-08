"use client";

import { useState } from "react";

export default function NotifyForm() {
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-xs font-black uppercase tracking-widest text-black">
        You&apos;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm gap-0">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+234 000 000 0000"
        className="flex-1 border border-zinc-300 border-r-0 px-4 py-3 text-xs font-semibold placeholder-zinc-400 outline-none focus:border-black"
      />
      <button
        type="submit"
        className="bg-black px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
      >
        Notify Me
      </button>
    </form>
  );
}
