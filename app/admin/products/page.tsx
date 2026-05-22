import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductsClient from "@/components/admin/ProductsClient";

export default async function ProductsPage() {
  const supabase = await createServiceClient();
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  const list = products ?? [];

  return (
    <>
      <AdminHeader title={`Products (${list.length})`} />
      <ProductsClient products={list} />
    </>
  );
}
