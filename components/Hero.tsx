import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-end bg-zinc-900">
      <Image
        src="/hero-bg.jpg"
        alt="Spaceworm SS25"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay so text stays readable over photography */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full px-6 pb-16 md:px-12 md:pb-20">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-300">
          Spring / Summer 2022
        </p>
        <h1 className="mb-8 max-w-2xl text-5xl font-black uppercase leading-none tracking-tight text-white md:text-7xl lg:text-8xl">
          No Signal.
          <br />
          No Noise.
        </h1>
        <Link
          href="/#products"
          className="inline-block bg-white px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-100"
        >
          Shop the Collection
        </Link>
      </div>
    </section>
  );
}
