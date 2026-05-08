import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="pt-14">
        <section className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
          <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
            404
          </p>
          <h1 className="mb-6 text-5xl font-black uppercase leading-none tracking-tight text-black md:text-7xl">
            Lost in Space.
          </h1>
          <p className="mb-10 max-w-sm text-sm leading-relaxed text-zinc-500">
            This page doesn&apos;t exist — or it used to and now it&apos;s gone.
            Either way, there&apos;s nothing here.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
            >
              Back to Shop
            </Link>
            <Link
              href="/drops"
              className="inline-block border border-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-50"
            >
              See Drops
            </Link>
          </div>
        </section>
        <Footer variant="compact" />
      </main>
    </>
  );
}
