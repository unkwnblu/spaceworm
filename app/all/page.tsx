import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { products } from "@/lib/mockData";
import AllClient from "./AllClient";

export const metadata: Metadata = {
  title: "All Products — Spaceworm",
  description: "The full Spaceworm catalogue. Filter by gender, category, and price.",
};

export default function AllPage() {
  return (
    <>
      <Header />
      <main className="pt-14">
        {/* Page header */}
        <div className="mx-auto max-w-screen-xl px-4 pb-2 pt-10 md:px-8 md:pt-14">
          <div className="flex items-end justify-between border-b border-zinc-100 pb-6">
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
                Spaceworm
              </p>
              <h1 className="text-4xl font-black uppercase leading-none tracking-tight text-black md:text-5xl">
                All Products
              </h1>
            </div>
          </div>
        </div>

        <Suspense>
          <AllClient products={products} />
        </Suspense>
      </main>
    </>
  );
}
