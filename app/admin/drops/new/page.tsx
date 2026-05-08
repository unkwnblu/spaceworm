"use client";

import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DropForm from "@/components/admin/DropForm";

export default function NewDropPage() {
  return (
    <>
      <AdminHeader title="New Drop" breadcrumb="Drops" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/drops"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Drops
          </Link>
        </div>
        <DropForm mode="create" />
      </main>
    </>
  );
}
