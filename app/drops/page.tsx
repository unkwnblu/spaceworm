import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/ProductCard";
import NotifyForm from "@/components/NotifyForm";

export const metadata: Metadata = {
  title: "Drops",
  description: "Limited releases and new arrivals. When they're gone, they're gone.",
};

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
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

export default async function DropsPage() {
  const supabase = await createClient();

  const { data: drops } = await supabase
    .from("drops")
    .select("*, drop_products(product_id, products(*))")
    .order("date", { ascending: false });

  const list = drops ?? [];

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
          {list.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                No drops yet — check back soon.
              </p>
            </div>
          )}
          {list.map((drop) => {
            const status = STATUS_CONFIG[drop.status] ?? STATUS_CONFIG.upcoming;
            const isSoldOut = drop.status === "sold-out";
            const products = (drop.drop_products as any[])
              ?.map((dp: any) => dp.products)
              .filter(Boolean) ?? [];

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
                    {drop.description && (
                      <p className="mb-6 max-w-lg text-sm leading-relaxed text-zinc-500">
                        {drop.description}
                      </p>
                    )}

                    {drop.status === "upcoming" && <NotifyForm />}

                    {drop.status === "sold-out" && (
                      <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                        This drop has ended.
                      </p>
                    )}
                  </div>
                </div>

                {/* Product grid */}
                {products.length > 0 && (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product: any) => (
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

        <Footer variant="compact" />
      </main>
    </>
  );
}
