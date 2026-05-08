import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { events } from "@/lib/mockData";

export const metadata: Metadata = {
  title: "Events — Spaceworm",
  description:
    "Pop-up shops, trunk shows, and in-person experiences. See Spaceworm in the real world.",
};

const STATUS_CONFIG = {
  upcoming: { label: "Upcoming", dot: "bg-black animate-pulse" },
  past: { label: "Past", dot: "bg-zinc-200" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatRange(start: string, end?: string) {
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear()) {
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
  }
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export default function EventsPage() {
  return (
    <>
      <Header />

      <main className="pt-14">
        {/* Page header */}
        <section className="border-b border-zinc-100 px-4 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
                  In Person
                </p>
                <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
                  Events
                </h1>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
                Pop-ups, trunk shows, and one-night-only experiences.
                Follow us for announcements — most events are first-come, first-served.
              </p>
            </div>
          </div>
        </section>

        {/* Events list */}
        <div className="mx-auto max-w-screen-xl px-4 md:px-8">
          {events.map((event) => {
            const status = STATUS_CONFIG[event.status];
            const isPast = event.status === "past";

            return (
              <section
                key={event.id}
                className={`border-b border-zinc-100 py-16 md:py-20 ${isPast ? "opacity-40" : ""}`}
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_2fr]">
                  {/* Left — meta */}
                  <div>
                    <p className="mb-2 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                      {event.location}
                    </p>
                    <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      {formatRange(event.date, event.endDate)}
                    </p>
                    <div className="mb-4 flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-black">
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">{event.venue}</p>
                  </div>

                  {/* Right — title + description */}
                  <div>
                    <h2 className="mb-4 text-3xl font-black uppercase leading-none tracking-tight text-black md:text-4xl">
                      {event.title}
                    </h2>
                    <p className="max-w-lg text-sm leading-relaxed text-zinc-500">
                      {event.description}
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <section className="px-4 py-16 md:px-8">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col items-start gap-6 border-t border-zinc-100 pt-12 md:flex-row md:items-center md:justify-between">
              <p className="text-xs leading-relaxed text-zinc-400">
                Want to host a Spaceworm pop-up?
                <br />
                Get in touch — hello@spaceworm.co
              </p>
              <a
                href="mailto:hello@spaceworm.co"
                className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
