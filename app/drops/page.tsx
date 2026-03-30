import type { Metadata } from "next";
import Header from "@/components/Header";
import Link from "next/link";
import { products } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Drops — Spaceworm",
  description: "Limited releases and new arrivals. When they're gone, they're gone.",
};

// Simulate drop releases — in production replace with Supabase-fetched drops
const DROPS = [
  {
    id: "drop-003",
    number: "003",
    title: "No Signal",
    date: "2025-04-12",
    status: "upcoming" as const,
    description:
      "A six-piece capsule built around the concept of disconnection. Heavyweight ripstop, matte hardware, zero logos. Drops 12 April, 10:00 WAT.",
    products: products.filter((p) => ["void-cargo-pant", "orbit-track-jacket"].includes(p.slug)),
  },
  {
    id: "drop-002",
    number: "002",
    title: "Hollow",
    date: "2025-02-01",
    status: "live" as const,
    description:
      "Eight pieces. All black. All limited. Built for the space between streetwear and technical wear. Available now while stock lasts.",
    products: products.filter((p) =>
      ["signal-hoodie", "wormhole-oversized-tee", "deep-field-puffer", "sector-seven-cap"].includes(p.slug)
    ),
  },
  {
    id: "drop-001",
    number: "001",
    title: "Void",
    date: "2024-11-15",
    status: "sold-out" as const,
    description:
      "The first drop. Four pieces. Sold out in 38 minutes. Thank you.",
    products: [],
  },
];

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", dot: "bg-zinc-300" },
  live:     { label: "Live Now", dot: "bg-black animate-pulse" },
  "sold-out": { label: "Sold Out", dot: "bg-zinc-200" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DropsPage() {
  return (
    <>
      <Header />

      <main className="pt-14">
        {/* — Page header — */}
        <section className="border-b border-zinc-100 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
                  Limited Releases
                </p>
                <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
                  Drops
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Every drop is a finite run. No restocks. No second chances.
                Sign up for SMS to be first in line.
              </p>
            </div>
          </div>
        </section>

        {/* — Drops list — */}
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          {DROPS.map((drop, i) => {
            const status = STATUS_CONFIG[drop.status];
            const isSoldOut = drop.status === "sold-out";

            return (
              <section
                key={drop.id}
                className={`border-b border-zinc-100 py-16 md:py-20 ${isSoldOut ? "opacity-40" : ""}`}
              >
                {/* Drop header row */}
                <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
                  {/* Left — meta */}
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                      Drop {drop.number}
                    </p>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {formatDate(drop.date)}
                    </p>
                    {/* Status pill */}
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {/* Right — title + description */}
                  <div>
                    <h2 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight text-black md:text-4xl">
                      {drop.title}
                    </h2>
                    <p className="mb-6 max-w-lg text-sm leading-relaxed text-zinc-500">
                      {drop.description}
                    </p>

                    {drop.status === "upcoming" && (
                      <div className="flex max-w-sm gap-0">
                        <input
                          type="tel"
                          placeholder="+234 000 000 0000"
                          className="flex-1 border border-zinc-300 border-r-0 px-4 py-3 text-xs font-semibold placeholder-zinc-400 outline-none focus:border-black"
                        />
                        <button className="bg-black px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800">
                          Notify Me
                        </button>
                      </div>
                    )}

                    {drop.status === "sold-out" && (
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                        This drop has ended.
                      </p>
                    )}
                  </div>
                </div>

                {/* Product grid */}
                {drop.products.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {drop.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* — Archive note — */}
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col items-start gap-6 border-t border-zinc-100 pt-12 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-relaxed text-zinc-400">
                All drops are limited-run and non-restockable.
                <br />
                Miss one — wait for the next.
              </p>
              <Link
                href="/"
                className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
              >
                Shop All
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-zinc-200">
          <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-zinc-400 md:flex-row">
              <p>© {new Date().getFullYear()} Spaceworm. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="/" className="hover:text-black">Shop</Link>
                <Link href="/about" className="hover:text-black">About</Link>
                <a href="#" className="hover:text-black">Privacy</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
