import Link from "next/link";
import { products, drops, events, orders } from "@/lib/mockData";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatusBadge from "@/components/admin/AdminStatusBadge";
import { toNGN } from "@/lib/mockData";

const activeDrops = drops.filter((d) => d.status === "live").length;
const upcomingEvents = events.filter((e) => e.status === "upcoming").length;

const STATS = [
  { label: "Products", value: products.length, href: "/admin/products" },
  { label: "Active Drops", value: activeDrops, href: "/admin/drops?status=live" },
  { label: "Upcoming Events", value: upcomingEvents, href: "/admin/events?status=upcoming" },
  { label: "Orders", value: orders.length, href: "/admin/orders" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardPage() {
  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="group border border-zinc-200 bg-white p-6 transition-colors hover:border-zinc-400"
            >
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 group-hover:text-zinc-600">
                {stat.label}
              </p>
              <p className="text-4xl font-black text-black">{stat.value}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Products */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Products
              </h2>
              <Link
                href="/admin/products"
                className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
              >
                View All
              </Link>
            </div>
            <div className="overflow-hidden border border-zinc-200 bg-white">
              <table className="w-full">
                <thead className="border-b border-zinc-100 bg-zinc-50">
                  <tr>
                    {["Name", "Category", "Price"].map((h) => (
                      <th key={h} className="px-4 py-2.5 text-left text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.slice(0, 5).map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-3 text-xs font-semibold text-black">
                        <Link href={`/admin/products/${p.id}`} className="hover:underline">
                          {p.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{p.category}</td>
                      <td className="px-4 py-3 text-xs text-zinc-500">{toNGN(p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Drops + Events */}
          <div className="flex flex-col gap-8">
            {/* Drops */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Drops
                </h2>
                <Link
                  href="/admin/drops"
                  className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-hidden border border-zinc-200 bg-white">
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-100">
                    {drops.map((d) => (
                      <tr key={d.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          #{d.number}
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-black">
                          <Link href={`/admin/drops/${d.id}`} className="hover:underline">
                            {d.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <AdminStatusBadge status={d.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Events */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Events
                </h2>
                <Link
                  href="/admin/events"
                  className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-black"
                >
                  View All
                </Link>
              </div>
              <div className="overflow-hidden border border-zinc-200 bg-white">
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-100">
                    {events.map((e) => (
                      <tr key={e.id} className="hover:bg-zinc-50">
                        <td className="px-4 py-3 text-xs font-semibold text-black">
                          <Link href={`/admin/events/${e.id}`} className="hover:underline">
                            {e.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-400">{e.location}</td>
                        <td className="px-4 py-3 text-right">
                          <AdminStatusBadge status={e.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
