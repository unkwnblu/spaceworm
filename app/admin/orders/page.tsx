import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge, { type Status } from "@/components/admin/AdminStatusBadge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function OrdersPage() {
  const supabase = await createServiceClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(id)")
    .order("created_at", { ascending: false });

  const list = orders ?? [];

  return (
    <>
      <AdminHeader title={`Orders (${list.length})`} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <AdminTable
          columns={["Order #", "Customer", "Email", "Date", "Items", "Shipping", "Total", "Status"]}
          isEmpty={list.length === 0}
          emptyLabel="No orders yet"
        >
          {list.map((o) => (
            <tr key={o.id} className="hover:bg-zinc-50">
              <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                #{o.number}
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-bold text-black">
                  {o.customer_name ?? "—"}
                </span>
              </td>
              <td className="px-4 py-4 text-xs text-zinc-500">{o.customer_email}</td>
              <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-500">
                {formatDate(o.created_at)}
              </td>
              <td className="px-4 py-4 text-xs text-zinc-500">
                {(o.order_items as { id: string }[]).length}
              </td>
              <td className="px-4 py-4 text-xs text-zinc-500">
                {o.shipping_fee ? fmt(o.shipping_fee) : "—"}
              </td>
              <td className="px-4 py-4 text-xs font-semibold text-zinc-700">
                {fmt(o.total)}
              </td>
              <td className="px-4 py-4">
                <AdminStatusBadge status={o.status as Status} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </main>
    </>
  );
}
