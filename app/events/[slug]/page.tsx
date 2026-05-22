import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createServiceClient } from "@/lib/supabase/server";
import type { DBEvent } from "@/lib/database.types";

export const revalidate = 60;

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'><rect width='1200' height='800' fill='%23111'/><text x='50%25' y='50%25' fill='%23333' font-family='monospace' font-size='18' text-anchor='middle' dominant-baseline='middle'>SPACEWORM</text></svg>";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShort(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
    weekday: d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase(),
  };
}

function eventHref(e: DBEvent) {
  return `/events/${e.slug || e.id}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createServiceClient();
  const { data } = await supabase.from("events").select("title, description").eq("slug", slug).maybeSingle();
  if (!data) return { title: "Event — Spaceworm" };
  return {
    title: `${data.title} — Spaceworm`,
    description: data.description ?? undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServiceClient();

  // Try by slug first; fall back to id for events without a slug yet.
  let { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (!event) {
    const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRe.test(slug)) {
      const fallback = await supabase.from("events").select("*").eq("id", slug).maybeSingle();
      event = fallback.data;
    }
  }

  if (!event) notFound();
  const e = event as DBEvent;

  // Other upcoming events
  const { data: othersData } = await supabase
    .from("events")
    .select("*")
    .neq("id", e.id)
    .eq("status", "upcoming")
    .order("date", { ascending: true })
    .limit(3);
  const others = (othersData ?? []) as DBEvent[];

  const isPast = e.status === "past";
  const start = formatShort(e.date);

  return (
    <>
      <Header />

      <main className="pt-14">
        {/* ─── HERO ─────────────────────────────────────────── */}
        <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden bg-zinc-900">
          <Image
            src={e.image_url || PLACEHOLDER}
            alt={e.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

          <div className="relative z-10 mx-auto flex h-full max-w-screen-xl flex-col justify-end px-4 pb-12 md:px-8 md:pb-16">
            <Link
              href="/events"
              className="mb-6 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white"
            >
              ← All Events
            </Link>

            <div className="flex items-center gap-3">
              <span className={`h-1.5 w-1.5 rounded-full ${isPast ? "bg-white/40" : "animate-pulse bg-white"}`} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
                {isPast ? "Past Event" : "Upcoming"}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                {e.location}
              </span>
            </div>

            <h1 className="mt-4 max-w-4xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
              {e.title}
            </h1>
          </div>
        </section>

        {/* ─── BODY ─────────────────────────────────────────── */}
        <section className="border-b border-zinc-100 px-4 py-16 md:px-8 md:py-20">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr] md:gap-16">
            {/* Left — meta sidebar */}
            <aside className="md:sticky md:top-24 md:self-start">
              <div className="border border-zinc-200 bg-white">
                {/* Date block */}
                <div className="border-b border-zinc-100 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    {e.end_date ? "Dates" : "Date"}
                  </p>
                  <p className="mt-3 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {start.weekday}
                  </p>
                  <p className="text-4xl font-black leading-none tracking-tight text-black">
                    {start.day} {start.month}
                  </p>
                  <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    {start.year}
                  </p>
                  {e.end_date && (
                    <>
                      <div className="my-3 h-px w-8 bg-zinc-200" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        through
                      </p>
                      <p className="text-xl font-black tracking-tight text-zinc-700">
                        {formatShort(e.end_date).day} {formatShort(e.end_date).month}
                      </p>
                    </>
                  )}
                </div>

                {/* Venue block */}
                <div className="border-b border-zinc-100 p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                    Venue
                  </p>
                  <p className="mt-3 text-base font-bold text-black">{e.venue}</p>
                  <p className="mt-1 text-xs text-zinc-500">{e.location}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${e.venue}, ${e.location}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-500 transition-colors hover:text-black"
                  >
                    Open in Maps →
                  </a>
                </div>

                {/* CTA */}
                {!isPast && e.ticket_url && (
                  <div className="p-6">
                    <a
                      href={e.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-black px-6 py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
                    >
                      RSVP →
                    </a>
                  </div>
                )}
                {!isPast && !e.ticket_url && (
                  <div className="p-6">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      Walk-ins welcome
                    </p>
                  </div>
                )}
              </div>
            </aside>

            {/* Right — body */}
            <article>
              {e.description && (
                <p className="mb-10 max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-black md:text-3xl">
                  {e.description}
                </p>
              )}
              {e.details ? (
                <div className="max-w-2xl space-y-5 text-base leading-relaxed text-zinc-700">
                  {e.details.split(/\n\n+/).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              ) : !e.description ? (
                <p className="max-w-2xl text-base leading-relaxed text-zinc-500">
                  Details to come.
                </p>
              ) : null}

              {/* Quick facts */}
              <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden border border-zinc-200 bg-zinc-200 md:grid-cols-3">
                <div className="bg-white p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">When</p>
                  <p className="mt-2 text-xs font-semibold text-black">{formatDate(e.date)}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Where</p>
                  <p className="mt-2 text-xs font-semibold text-black">{e.venue}</p>
                </div>
                <div className="bg-white p-5">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Cost</p>
                  <p className="mt-2 text-xs font-semibold text-black">Free entry</p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ─── RELATED EVENTS ───────────────────────────────── */}
        {others.length > 0 && (
          <section className="px-4 py-16 md:px-8">
            <div className="mx-auto max-w-screen-xl">
              <div className="mb-8 flex items-end justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Other Upcoming Events
                </h3>
                <Link href="/events" className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">
                  All Events →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((o) => {
                  const d = formatShort(o.date);
                  return (
                    <Link key={o.id} href={eventHref(o)} className="group block">
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={o.image_url || PLACEHOLDER}
                          alt={o.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                        <div className="absolute left-4 top-4 bg-white px-3 py-2 text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{d.month}</p>
                          <p className="text-2xl font-black leading-none tracking-tight text-black">{d.day}</p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{o.location}</p>
                        <h4 className="mt-2 text-lg font-black uppercase leading-tight tracking-tight text-black transition-colors group-hover:text-zinc-600">
                          {o.title}
                        </h4>
                        <p className="mt-1 text-xs text-zinc-500">{o.venue}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <Footer variant="compact" />
      </main>
    </>
  );
}
