import { orders, toNGN } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTable from "@/components/admin/AdminTable";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersPage() {
  return (
    <>
      <AdminHeader title={`Orders (${orders.length})`} />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
        <div className="mb-6 border border-zinc-200 bg-white px-5 py-3">
          <p className="text-[10px] text-zinc-400">
            Showing mock data — orders will populate from Paystack once integrated.
          </p>
        </div>

        <AdminTable
          columns={["Order #", "Customer", "Date", "Items", "Total", "Status"]}
        >
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-zinc-50">
              <td className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                #{o.number}
              </td>
              <td className="px-4 py-4">
                <span className="text-xs font-bold text-black">{o.customer}</span>
              </td>
              <td className="whitespace-nowrap px-4 py-4 text-xs text-zinc-500">{formatDate(o.date)}</td>
              <td className="px-4 py-4 text-xs text-zinc-500">
                {o.items} {o.items === 1 ? "item" : "items"}
              </td>
              <td className="px-4 py-4 text-xs font-semibold text-zinc-700">
                {toNGN(o.total)}
              </td>
              <td className="px-4 py-4">
                <AdminStatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </AdminTable>
      </main>
    </>
  );
}
