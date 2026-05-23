import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import OrdersClient from "@/components/admin/OrdersClient";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(id)")
    .order("created_at", { ascending: false });

  const list = (orders ?? []).map((o) => ({
    id: o.id,
    number: o.number,
    customer_name: o.customer_name,
    customer_email: o.customer_email,
    shipping_fee: o.shipping_fee,
    status: o.status,
    total: o.total,
    created_at: o.created_at,
    item_count: (o.order_items as { id: string }[]).length,
  }));

  return (
    <>
      <AdminHeader title={`Orders (${list.length})`} />
      <OrdersClient orders={list} />
    </>
  );
}
