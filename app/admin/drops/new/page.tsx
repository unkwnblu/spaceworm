import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import DropForm from "@/components/admin/DropForm";

export const dynamic = "force-dynamic";

export default async function NewDropPage() {
  const supabase = await createServiceClient();
  const { data: allProducts } = await supabase
    .from("products")
    .select("*")
    .order("name");

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
        <DropForm mode="create" allProducts={allProducts ?? []} />
      </main>
    </>
  );
}
