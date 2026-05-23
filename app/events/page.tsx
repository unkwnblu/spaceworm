import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createServiceClient } from "@/lib/supabase/server";
import type { DBEvent } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Pop-up shops, trunk shows, and in-person experiences. See Spaceworm in the real world.",
};

export const revalidate = 60;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRange(start: string, end?: string | null) {
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

function formatShortMonth(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
}

function eventHref(e: DBEvent) {
  return `/events/${e.slug || e.id}`;
}

const PLACEHOLDER =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23111'/><text x='50%25' y='50%25' fill='%23333' font-family='monospace' font-size='14' text-anchor='middle' dominant-baseline='middle'>SPACEWORM</text></svg>";

export default async function EventsPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true });

  const all = (data ?? []) as DBEvent[];
  const upcoming = all.filter((e) => e.status === "upcoming");
  const past = all.filter((e) => e.status === "past").reverse();

  const featured = upcoming[0];
  const restUpcoming = upcoming.slice(1);

  return (
    <>
      <Header />

      <main className="pt-14">
        {/* ─── FEATURED / NEXT EVENT ─────────────────────────── */}
        {featured ? (
          <section className="relative h-[80vh] min-h-[520px] w-full overflow-hidden bg-zinc-900">
            <Image
              src={featured.image_url || PLACEHOLDER}
              alt={featured.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

            <div className="relative z-10 mx-auto flex h-full max-w-screen-xl flex-col justify-between px-4 py-12 md:px-8 md:py-16">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">
                  Next Event
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr] md:items-end md:gap-12">
                {/* Big date block */}
                <div className="text-white">
                  <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/70">
                    {formatShortMonth(featured.date).month} {formatShortMonth(featured.date).year}
                  </p>
                  <p className="text-7xl font-black leading-none tracking-tight md:text-8xl">
                    {formatShortMonth(featured.date).day}
                  </p>
                  {featured.end_date && (
                    <p className="mt-2 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                      Through {formatShortMonth(featured.end_date).day} {formatShortMonth(featured.end_date).month}
                    </p>
                  )}
                </div>

                <div className="text-white">
                  <p className="mb-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
                    {featured.location} · {featured.venue}
                  </p>
                  <h1 className="mb-5 text-4xl font-black uppercase leading-none tracking-tight md:text-6xl">
                    {featured.title}
                  </h1>
                  {featured.description && (
                    <p className="mb-7 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
                      {featured.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={eventHref(featured)}
                      className="inline-block bg-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-100"
                    >
                      Event Details
                    </Link>
                    {featured.ticket_url && (
                      <a
                        href={featured.ticket_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-white px-7 py-3.5 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-white hover:text-black"
                      >
                        RSVP →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          // Empty hero when no upcoming
          <section className="border-b border-zinc-100 bg-zinc-50 px-4 py-24 md:px-8 md:py-32">
            <div className="mx-auto max-w-screen-xl text-center">
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
                In Person
              </p>
              <h1 className="mb-4 text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
                Events
              </h1>
              <p className="mx-auto max-w-md text-sm text-zinc-500">
                No upcoming events right now. Follow us for announcements.
              </p>
            </div>
          </section>
        )}

        {/* ─── INTRO STRIP ───────────────────────────────────── */}
        <section className="border-b border-zinc-100 px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
                  In Person · {upcoming.length} upcoming
                </p>
                <h2 className="text-3xl font-black uppercase leading-none tracking-tight text-black md:text-4xl">
                  All Events
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Pop-ups, trunk shows, and one-night-only experiences. Most events are
                first-come, first-served.
              </p>
            </div>
          </div>
        </section>

        {/* ─── UPCOMING GRID ─────────────────────────────────── */}
        {restUpcoming.length > 0 && (
          <section className="px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-screen-xl">
              <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Upcoming
              </h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {restUpcoming.map((e) => {
                  const d = formatShortMonth(e.date);
                  return (
                    <Link
                      key={e.id}
                      href={eventHref(e)}
                      className="group flex flex-col"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                        <Image
                          src={e.image_url || PLACEHOLDER}
                          alt={e.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                        {/* Date badge */}
                        <div className="absolute left-4 top-4 bg-white px-3 py-2 text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                            {d.month}
                          </p>
                          <p className="text-2xl font-black leading-none tracking-tight text-black">
                            {d.day}
                          </p>
                        </div>
                        {/* Status dot */}
                        <div className="absolute right-4 top-4 flex items-center gap-1.5 bg-black/80 px-2.5 py-1.5 text-white backdrop-blur-sm">
                          <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Upcoming
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                          {e.location}
                        </p>
                        <h4 className="mt-2 text-xl font-black uppercase leading-tight tracking-tight text-black transition-colors group-hover:text-zinc-600">
                          {e.title}
                        </h4>
                        <p className="mt-2 text-xs text-zinc-500">{e.venue}</p>
                        <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                          {formatRange(e.date, e.end_date)}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── PAST / ARCHIVE ────────────────────────────────── */}
        {past.length > 0 && (
          <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-12 md:px-8 md:py-16">
            <div className="mx-auto max-w-screen-xl">
              <h3 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Archive · {past.length}
              </h3>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {past.map((e) => {
                  const d = formatShortMonth(e.date);
                  return (
                    <Link key={e.id} href={eventHref(e)} className="group block">
                      <div className="relative aspect-square w-full overflow-hidden bg-zinc-200">
                        <Image
                          src={e.image_url || PLACEHOLDER}
                          alt={e.title}
                          fill
                          className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                          sizes="(min-width: 1024px) 25vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-white/40 transition-opacity group-hover:opacity-0" />
                      </div>
                      <div className="mt-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                          {d.month} {d.year} · {e.location}
                        </p>
                        <h4 className="mt-1.5 text-sm font-black uppercase leading-tight tracking-tight text-zinc-700 transition-colors group-hover:text-black">
                          {e.title}
                        </h4>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── BOTTOM CTA ────────────────────────────────────── */}
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col items-start gap-6 border-t border-zinc-100 pt-12 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                  Host a Spaceworm pop-up
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  Got a space? We&apos;re always looking for new cities.
                </p>
              </div>
              <a
                href="mailto:hello@spaceworm.co"
                className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
