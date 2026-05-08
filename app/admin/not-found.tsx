import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminNotFound() {
  return (
    <>
      <AdminHeader title="Not Found" />
      <main className="flex flex-1 flex-col items-center justify-center p-10 text-center">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-300">
          404
        </p>
        <h1 className="mb-4 text-2xl font-black uppercase tracking-tight text-black">
          Page Not Found
        </h1>
        <p className="mb-10 text-sm text-zinc-400">
          This record doesn&apos;t exist or may have been deleted.
        </p>
        <Link
          href="/admin/dashboard"
          className="bg-black px-8 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
        >
          Back to Dashboard
        </Link>
      </main>
    </>
  );
}
