import { notFound } from "next/navigation";
import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) notFound();

  return (
    <>
      <AdminHeader title={product.name} breadcrumb="Products" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6">
          <Link
            href="/admin/products"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
          >
            ← Back to Products
          </Link>
        </div>

        <ProductForm
          initialData={product}
          dangerZone={
            <div className="border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-400">
                Danger Zone
              </h2>
              <DeleteButton
                url={`/api/admin/products/${id}`}
                redirectTo="/admin/products"
                label="Delete Product"
              />
            </div>
          }
        />
      </main>
    </>
  );
}
