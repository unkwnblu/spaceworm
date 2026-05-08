"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { events } from "@/lib/mockData";
import type { EventStatus } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

const FILTERS: { label: string; value: EventStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Past", value: "past" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EventsContent() {
  const searchParams = useSearchParams();
  const initStatus = searchParams.get("status") as EventStatus | null;
  const validStatuses: (EventStatus | "all")[] = ["all", "upcoming", "past"];
  const [filter, setFilter] = useState<EventStatus | "all">(
    initStatus && validStatuses.includes(initStatus) ? initStatus : "all"
  );
  const filtered =
    filter === "all" ? events : events.filter((e) => e.status === filter);

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
          href="/admin/events/new"
          className="bg-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-zinc-800"
        >
          + New Event
        </Link>
      </div>

      <AdminTable
        columns={["Title", "Date", "End Date", "Location", "Venue", "Status", ""]}
        isEmpty={filtered.length === 0}
        emptyLabel="No events found"
      >
        {filtered.map((e) => (
          <tr key={e.id} className="hover:bg-zinc-50">
            <td className="px-4 py-4">
              <span className="text-xs font-bold text-black">{e.title}</span>
            </td>
            <td className="px-4 py-4 text-xs text-zinc-500">
              {formatDate(e.date)}
            </td>
            <td className="px-4 py-4 text-xs text-zinc-500">
              {e.endDate ? (
                formatDate(e.endDate)
              ) : (
                <span className="text-zinc-300">—</span>
              )}
            </td>
            <td className="px-4 py-4 text-xs text-zinc-500">{e.location}</td>
            <td className="px-4 py-4 text-xs text-zinc-500">{e.venue}</td>
            <td className="px-4 py-4">
              <AdminStatusBadge status={e.status} />
            </td>
            <td className="px-4 py-4 text-right">
              <div className="flex items-center justify-end gap-3">
                <Link
                  href="/events"
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
                  href={`/admin/events/${e.id}`}
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

export default function EventsAdminPage() {
  return (
    <>
      <AdminHeader title="Events" />
      <Suspense>
        <EventsContent />
      </Suspense>
    </>
  );
}
