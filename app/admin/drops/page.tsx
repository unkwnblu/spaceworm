"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { drops } from "@/lib/mockData";
import type { DropStatus } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const FILTERS: { label: string; value: DropStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "Sold Out", value: "sold-out" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DropsContent() {
  const searchParams = useSearchParams();
  const initStatus = searchParams.get("status") as DropStatus | null;
  const validStatuses: (DropStatus | "all")[] = [
    "all",
    "upcoming",
    "live",
    "sold-out",
  ];
  const [filter, setFilter] = useState<DropStatus | "all">(
    initStatus && validStatuses.includes(initStatus) ? initStatus : "all"
  );
  const filtered =
    filter === "all" ? drops : drops.filter((d) => d.status === filter);

  return (
    <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex gap-6 border-b border-zinc-200">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`relative pb-4 text-[10px] font-black uppercase tracking-widest transition-colors ${
                filter === f.value
                  ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-black after:content-['']"
                  : "text-zinc-400 hover:text-black"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <Link
          href="/admin/drops/new"
          className="bg-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
        >
          + New Drop
        </Link>
      </div>

      <AdminTable
        columns={["#", "Title", "Date", "Status", "Products", ""]}
        isEmpty={filtered.length === 0}
        emptyLabel="No drops found"
      >
        {filtered.map((d) => (
          <tr key={d.id} className="hover:bg-zinc-50">
            <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              {d.number}
            </td>
            <td className="px-4 py-4">
              <span className="text-xs font-bold text-black">{d.title}</span>
            </td>
            <td className="px-4 py-4 text-xs text-zinc-500">
              {formatDate(d.date)}
            </td>
            <td className="px-4 py-4">
              <AdminStatusBadge status={d.status} />
            </td>
            <td className="px-4 py-4 text-xs text-zinc-500">
              {d.products.length}
            </td>
            <td className="px-4 py-4 text-right">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/drops"
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
                  href={`/admin/drops/${d.id}`}
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
  );
}

export default function DropsAdminPage() {
  return (
    <>
      <AdminHeader title="Drops" />
      <Suspense>
        <DropsContent />
      </Suspense>
    </>
  );
}
