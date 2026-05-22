import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminStatusBadge, { type Status } from "@/components/admin/AdminStatusBadge";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", notation: "compact", maximumFractionDigits: 1 }).format(n);

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const DAY_MS = 86_400_000;

function buildDailyRevenue(orders: { total: number; created_at: string }[], days: number, endDate: Date) {
  const buckets = new Array(days).fill(0) as number[];
  const end = endDate.getTime();
  for (const o of orders) {
    const t = new Date(o.created_at).getTime();
    const idx = days - 1 - Math.floor((end - t) / DAY_MS);
    if (idx >= 0 && idx < days) buckets[idx] += o.total;
  }
  return buckets;
}

function sparklinePath(values: number[], width: number, height: number) {
  if (values.length === 0) return { line: "", area: "" };
  const max = Math.max(...values, 1);
  const stepX = width / Math.max(values.length - 1, 1);
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * height;
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  return { line, area };
}

export default async function DashboardPage() {
  const supabase = await createServiceClient();

  const now = new Date();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * DAY_MS).toISOString();

  const [
    { count: productCount },
    { count: activeDropCount },
    { count: upcomingEventCount },
    { count: orderCount },
    { data: recentProducts },
    { data: liveDrops },
    { data: upcomingEvents },
    { data: recentOrders },
    { data: revenueOrders },
    { data: recentProductUpdates },
    { data: recentDropUpdates },
    { data: recentEventUpdates },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("drops").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("id, name, category, price, slug").order("created_at", { ascending: false }).limit(5),
    supabase.from("drops").select("id, number, title, status").eq("status", "live").order("date", { ascending: false }).limit(3),
    supabase.from("events").select("id, title, location, date, status").eq("status", "upcoming").order("date", { ascending: true }).limit(3),
    supabase.from("orders").select("id, number, customer_name, customer_email, total, status, created_at").order("created_at", { ascending: false }).limit(6),
    supabase.from("orders").select("total, created_at").gte("created_at", sixtyDaysAgo),
    supabase.from("products").select("id, name, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("drops").select("id, title, status, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
    supabase.from("events").select("id, title, status, updated_at, created_at").order("updated_at", { ascending: false }).limit(5),
  ] as const);

  // ─── Revenue math ────────────────────────────────────────────
  const orders60 = revenueOrders ?? [];
  const thirtyDaysAgo = now.getTime() - 30 * DAY_MS;
  const sixtyAgo = now.getTime() - 60 * DAY_MS;

  let revCurrent = 0;
  let revPrev = 0;
  let ordersCurrent = 0;
  for (const o of orders60) {
    const t = new Date(o.created_at).getTime();
    if (t >= thirtyDaysAgo) { revCurrent += o.total; ordersCurrent += 1; }
    else if (t >= sixtyAgo) { revPrev += o.total; }
  }
  const revDelta = revPrev > 0 ? ((revCurrent - revPrev) / revPrev) * 100 : null;
  const aov = ordersCurrent > 0 ? revCurrent / ordersCurrent : 0;

  const daily = buildDailyRevenue(orders60.filter(o => new Date(o.created_at).getTime() >= thirtyDaysAgo), 30, now);
  const SPARK_W = 600;
  const SPARK_H = 80;
  const spark = sparklinePath(daily, SPARK_W, SPARK_H);

  // ─── Activity feed ───────────────────────────────────────────
  type Activity = { kind: "order" | "product" | "drop" | "event"; label: string; sub: string; iso: string; href: string };
  const activity: Activity[] = [];

  for (const o of recentOrders ?? []) {
    activity.push({
      kind: "order",
      label: o.status === "fulfilled" ? `Order #${o.number} fulfilled` : `Order #${o.number} placed`,
      sub: o.customer_name ?? o.customer_email,
      iso: o.created_at,
      href: "/admin/orders",
    });
  }
  for (const p of recentProductUpdates ?? []) {
    const isNew = p.created_at === p.updated_at;
    activity.push({
      kind: "product",
      label: `${isNew ? "Added" : "Updated"} product · ${p.name}`,
      sub: "Catalog",
      iso: p.updated_at,
      href: `/admin/products/${p.id}`,
    });
  }
  for (const d of recentDropUpdates ?? []) {
    const isNew = d.created_at === d.updated_at;
    activity.push({
      kind: "drop",
      label: isNew ? `New drop · ${d.title}` : `Drop "${d.title}" updated`,
      sub: `Status: ${d.status}`,
      iso: d.updated_at,
      href: `/admin/drops/${d.id}`,
    });
  }
  for (const e of recentEventUpdates ?? []) {
    const isNew = e.created_at === e.updated_at;
    activity.push({
      kind: "event",
      label: `${isNew ? "Added" : "Updated"} event · ${e.title}`,
      sub: `Status: ${e.status}`,
      iso: e.updated_at,
      href: `/admin/events/${e.id}`,
    });
  }
  activity.sort((a, b) => new Date(b.iso).getTime() - new Date(a.iso).getTime());
  const feed = activity.slice(0, 8);

  const liveDrop = (liveDrops ?? [])[0];
  const nextEvent = (upcomingEvents ?? [])[0];

  // ─── Secondary stats ─────────────────────────────────────────
  const SECONDARY = [
    {
      label: "Orders",
      value: String(orderCount ?? 0),
      sub: ordersCurrent > 0 ? `${ordersCurrent} in last 30d` : "—",
      href: "/admin/orders",
    },
    {
      label: "AOV · 30d",
      value: aov > 0 ? fmtCompact(aov) : "—",
      sub: aov > 0 ? "Average order value" : "No orders yet",
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: String(productCount ?? 0),
      sub: `${(recentProducts ?? []).length} recently added`,
      href: "/admin/products",
    },
    {
      label: "Drops Live",
      value: String(activeDropCount ?? 0),
      sub: liveDrop ? liveDrop.title : "None live",
      href: "/admin/drops?status=live",
    },
  ];

  return (
    <>
      <AdminHeader title="Dashboard" />
      <main className="flex-1 overflow-y-auto bg-zinc-50">
        <div className="mx-auto max-w-[1400px] p-6 md:p-8 lg:p-10">

          {/* ─── HERO REVENUE ───────────────────────────────────── */}
          <section className="mb-6 border border-zinc-200 bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto]">
              <div className="border-b border-zinc-100 p-8 lg:border-b-0 lg:border-r lg:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Revenue · Last 30 days
                  </span>
                  <span className="h-px flex-1 bg-zinc-100" />
                </div>
                <div className="flex flex-wrap items-end gap-x-8 gap-y-2">
                  <p className="text-5xl font-black leading-none tracking-tight text-black lg:text-6xl">
                    {revCurrent > 0 ? fmt(revCurrent) : "₦0"}
                  </p>
                  {revDelta !== null && (
                    <div className="flex items-baseline gap-2">
                      <span className={`text-sm font-black ${revDelta >= 0 ? "text-black" : "text-zinc-400"}`}>
                        {revDelta >= 0 ? "▲" : "▼"} {Math.abs(revDelta).toFixed(1)}%
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                        vs prev 30d
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-8">
                  <svg
                    viewBox={`0 0 ${SPARK_W} ${SPARK_H}`}
                    preserveAspectRatio="none"
                    className="h-20 w-full"
                  >
                    {spark.area && (
                      <path d={spark.area} fill="rgb(0 0 0 / 0.04)" />
                    )}
                    {spark.line && (
                      <path d={spark.line} fill="none" stroke="black" strokeWidth="1.5" />
                    )}
                  </svg>
                  <div className="mt-2 flex justify-between text-[9px] font-semibold uppercase tracking-widest text-zinc-300">
                    <span>30d ago</span>
                    <span>Today</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:flex lg:w-72 lg:flex-col">
                <div className="border-b border-zinc-100 p-6 lg:flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Live Drop</p>
                  <p className="mt-3 text-xl font-black text-black">
                    {liveDrop ? liveDrop.title : "—"}
                  </p>
                  {liveDrop && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      #{liveDrop.number}
                    </p>
                  )}
                </div>
                <div className="border-b border-l border-zinc-100 p-6 lg:border-l-0 lg:flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Next Event</p>
                  <p className="mt-3 text-xl font-black text-black">
                    {nextEvent ? nextEvent.title : "—"}
                  </p>
                  {nextEvent && (
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {nextEvent.location} · {formatDate(nextEvent.date)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECONDARY STATS ────────────────────────────────── */}
          <section className="mb-10 grid grid-cols-2 gap-px overflow-hidden border border-zinc-200 bg-zinc-200 lg:grid-cols-4">
            {SECONDARY.map((stat) => (
              <Link
                key={stat.label}
                href={stat.href}
                className="group bg-white p-6 transition-colors hover:bg-zinc-50"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-3xl font-black tracking-tight text-black">
                  {stat.value}
                </p>
                <p className="mt-2 truncate text-[10px] font-semibold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600">
                  {stat.sub}
                </p>
              </Link>
            ))}
          </section>

          {/* ─── ORDERS + ACTIVITY ──────────────────────────────── */}
          <section className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            {/* Recent Orders */}
            <div className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Recent Orders</h2>
                <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                  View All →
                </Link>
              </div>
              {(recentOrders ?? []).length === 0 ? (
                <div className="px-6 py-12 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  No orders yet
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {(recentOrders ?? []).map((o) => (
                    <li key={o.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-zinc-50">
                      <span className="w-16 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        #{o.number}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">
                          {o.customer_name ?? o.customer_email}
                        </p>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                          {formatDate(o.created_at)}
                        </p>
                      </div>
                      <span className="text-sm font-black tracking-tight text-black">
                        {fmt(o.total)}
                      </span>
                      <AdminStatusBadge status={o.status as Status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Activity Feed */}
            <div className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Activity</h2>
              </div>
              {feed.length === 0 ? (
                <div className="px-6 py-12 text-center text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                  No activity
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100">
                  {feed.map((a, i) => (
                    <li key={i}>
                      <Link href={a.href} className="block px-6 py-3.5 transition-colors hover:bg-zinc-50">
                        <div className="flex items-start gap-3">
                          <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-black" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-semibold text-black">{a.label}</p>
                            <div className="mt-0.5 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-widest text-zinc-400">
                              <span>{a.sub}</span>
                              <span>·</span>
                              <span>{timeAgo(a.iso)}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ─── CATALOG SNAPSHOT ───────────────────────────────── */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Products */}
            <div className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Catalog</h2>
                <Link href="/admin/products" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                  All →
                </Link>
              </div>
              <ul className="divide-y divide-zinc-100">
                {(recentProducts ?? []).map((p) => (
                  <li key={p.id}>
                    <Link href={`/admin/products/${p.id}`} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-zinc-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">{p.name}</p>
                        <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">{p.category}</p>
                      </div>
                      <span className="text-xs font-semibold tracking-tight text-zinc-600">{fmt(p.price)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Drops */}
            <div className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Drops</h2>
                <Link href="/admin/drops" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                  All →
                </Link>
              </div>
              <ul className="divide-y divide-zinc-100">
                {(liveDrops ?? []).concat((recentDropUpdates ?? []).filter(d => !liveDrops?.some(ld => ld.id === d.id)) as never).slice(0, 5).map((d) => (
                  <li key={d.id}>
                    <Link href={`/admin/drops/${d.id}`} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-zinc-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">{d.title}</p>
                        {"number" in d && (
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">#{d.number}</p>
                        )}
                      </div>
                      <AdminStatusBadge status={d.status as Status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Events */}
            <div className="border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Events</h2>
                <Link href="/admin/events" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                  All →
                </Link>
              </div>
              <ul className="divide-y divide-zinc-100">
                {(upcomingEvents ?? []).concat((recentEventUpdates ?? []).filter(e => !upcomingEvents?.some(ue => ue.id === e.id)) as never).slice(0, 5).map((e) => (
                  <li key={e.id}>
                    <Link href={`/admin/events/${e.id}`} className="flex items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-zinc-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-black">{e.title}</p>
                        {"location" in e && (
                          <p className="text-[9px] font-semibold uppercase tracking-widest text-zinc-400">{e.location}</p>
                        )}
                      </div>
                      <AdminStatusBadge status={e.status as Status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>
      </main>
    </>
  );
}
