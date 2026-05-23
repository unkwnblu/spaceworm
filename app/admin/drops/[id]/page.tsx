import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import DropForm from "@/components/admin/DropForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditDropPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const [{ data: drop }, { data: dropProducts }, { data: allProducts }] = await Promise.all([
    supabase.from("drops").select("*").eq("id", id).single(),
    supabase.from("drop_products").select("product_id").eq("drop_id", id),
    supabase.from("products").select("*").order("name"),
  ]);

  if (!drop) notFound();

  const initialProductIds = (dropProducts ?? []).map((dp) => dp.product_id);

  return (
    <>
      <AdminHeader title={`Drop ${drop.number} — ${drop.title}`} breadcrumb="Drops" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/drops"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Drops
          </Link>
        </div>

        <DropForm
          initialData={drop}
          initialProductIds={initialProductIds}
          allProducts={allProducts ?? []}
          dangerZone={
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                Danger Zone
              </h2>
              <DeleteButton
                url={`/api/admin/drops/${id}`}
                redirectTo="/admin/drops"
                label="Delete Drop"
              />
            </div>
          }
        />
      </main>
    </>
  );
}
