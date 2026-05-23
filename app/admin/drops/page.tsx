import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import DropsClient from "@/components/admin/DropsClient";

export const dynamic = "force-dynamic";

export default async function DropsAdminPage() {
  const supabase = await createServiceClient();
  const { data: drops } = await supabase
    .from("drops")
    .select("*, drop_products(product_id)")
    .order("date", { ascending: false });

  return (
    <>
      <AdminHeader title="Drops" />
      <DropsClient drops={drops ?? []} />
    </>
  );
}
