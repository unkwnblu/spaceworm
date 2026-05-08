"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, toNGN } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <AdminHeader title={`Products (${products.length})`} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 border border-zinc-300 bg-white px-3 py-2 text-sm text-black outline-none transition-colors placeholder:text-zinc-400 focus:border-black"
          />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
            Showing {filtered.length} of {products.length}
          </span>
          <div className="ml-auto">
            <Link
              href="/admin/products/new"
              className="bg-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
            >
              + New Product
            </Link>
          </div>
        </div>

        <AdminTable
          columns={["#", "Name", "Category", "Gender", "Price", "Sizes", "Tag", ""]}
          isEmpty={filtered.length === 0}
          emptyLabel="No products found"
        >
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-zinc-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-8 flex-shrink-0 overflow-hidden border border-zinc-100 bg-zinc-50">
                    {p.images?.[0] && (
                      <Image
                        src={p.images[0]}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="32px"
                      />
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-400">
                    {p.id}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="block max-w-[180px] truncate text-xs font-bold text-black">
                  {p.name}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-zinc-500">{p.category}</td>
              <td className="px-4 py-3 text-xs text-zinc-500">{p.gender}</td>
              <td className="px-4 py-3 text-xs text-zinc-700">{toNGN(p.price)}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {p.sizes.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="border border-zinc-200 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-zinc-500"
                    >
                      {s}
                    </span>
                  ))}
                  {p.sizes.length > 3 && (
                    <span className="text-[9px] text-zinc-400">
                      +{p.sizes.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                {p.tag ? (
                  <span className="border border-zinc-300 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                    {p.tag}
                  </span>
                ) : (
                  <span className="text-zinc-300">—</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/product/${p.slug}`}
                    target="_blank"
                    className="text-zinc-300 transition-colors hover:text-black"
                    title="View on site"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </Link>
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black"
                  >
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </main>
    </>
  );
}
