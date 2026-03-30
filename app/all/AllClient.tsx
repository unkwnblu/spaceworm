"use client";

import { useState, useMemo } from "react";
import { Product, toNGN } from "@/lib/mockData";
import ProductCard from "@/components/ProductCard";

type Props = { products: Product[] };

const CATEGORIES = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];
const GENDERS = ["All", "Men", "Women", "Unisex"];
const SORTS = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "New Arrivals", value: "new" },
];

export default function AllClient({ products }: Props) {
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let result = [...products];

    if (gender !== "All") result = result.filter((p) => p.gender === gender);
    if (category !== "All") result = result.filter((p) => p.category === category);

    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "new") result = result.filter((p) => p.tag === "New").concat(result.filter((p) => p.tag !== "New"));

    return result;
  }, [products, gender, category, sort]);

  const activeFilterCount = (gender !== "All" ? 1 : 0) + (category !== "All" ? 1 : 0);

  function clearAll() {
    setGender("All");
    setCategory("All");
    setSort("featured");
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 pb-20 md:px-8">

      {/* — Top bar — */}
      <div className="flex items-center justify-between border-b border-zinc-100 py-4">
        {/* Left: filter toggle (mobile) + active pills */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest md:hidden"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filter
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center bg-black text-[9px] font-bold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Active filter pills */}
          <div className="hidden items-center gap-2 md:flex">
            {gender !== "All" && (
              <button
                onClick={() => setGender("All")}
                className="flex items-center gap-1.5 border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              >
                {gender} <span>×</span>
              </button>
            )}
            {category !== "All" && (
              <button
                onClick={() => setCategory("All")}
                className="flex items-center gap-1.5 border border-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
              >
                {category} <span>×</span>
              </button>
            )}
            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black underline">
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Right: count + sort */}
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border-0 bg-transparent text-[10px] font-black uppercase tracking-widest text-black outline-none cursor-pointer"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-10 pt-8">

        {/* — Sidebar filters (desktop) — */}
        <aside className="hidden w-44 shrink-0 md:block">

          {/* Gender */}
          <div className="mb-8">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-black">
              Gender
            </p>
            <ul className="flex flex-col gap-2">
              {GENDERS.map((g) => (
                <li key={g}>
                  <button
                    onClick={() => setGender(g)}
                    className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                      gender === g ? "text-black" : "text-zinc-400 hover:text-black"
                    }`}
                  >
                    <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${gender === g ? "bg-black" : "bg-transparent border border-zinc-300"}`} />
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Category */}
          <div className="mb-8">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-black">
              Category
            </p>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.map((c) => (
                <li key={c}>
                  <button
                    onClick={() => setCategory(c)}
                    className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
                      category === c ? "text-black" : "text-zinc-400 hover:text-black"
                    }`}
                  >
                    <span className={`mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle ${category === c ? "bg-black" : "bg-transparent border border-zinc-300"}`} />
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Price range label */}
          <div>
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-black">
              Price
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { label: "Under ₦100k", fn: () => setSort("price-asc") },
                { label: "₦100k – ₦200k", fn: () => setSort("featured") },
                { label: "Over ₦200k", fn: () => setSort("price-desc") },
              ].map((item) => (
                <li key={item.label}>
                  <button
                    onClick={item.fn}
                    className="text-xs font-semibold uppercase tracking-widest text-zinc-400 transition-colors hover:text-black"
                  >
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full border border-zinc-300 align-middle" />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* — Mobile filter drawer — */}
        {filtersOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setFiltersOpen(false)} />
            <div className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white md:hidden">
              <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-6">
                <span className="text-xs font-black uppercase tracking-widest">Filters</span>
                <button onClick={() => setFiltersOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-6">
                {/* Gender */}
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]">Gender</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
                        gender === g ? "border-black bg-black text-white" : "border-zinc-300 text-black hover:border-black"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                {/* Category */}
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]">Category</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-colors ${
                        category === c ? "border-black bg-black text-white" : "border-zinc-300 text-black hover:border-black"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t border-zinc-100 p-6">
                <button
                  onClick={() => { clearAll(); setFiltersOpen(false); }}
                  className="mb-3 w-full border border-zinc-300 py-3 text-xs font-black uppercase tracking-widest text-black hover:border-black"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="w-full bg-black py-3 text-xs font-black uppercase tracking-widest text-white"
                >
                  Show {filtered.length} Results
                </button>
              </div>
            </div>
          </>
        )}

        {/* — Product grid — */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
                No products found
              </p>
              <button
                onClick={clearAll}
                className="text-xs font-black uppercase tracking-widest underline hover:text-zinc-600"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
