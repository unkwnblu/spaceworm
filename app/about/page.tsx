import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Spaceworm",
  description:
    "Spaceworm exists in the gap between streetwear and technical wear. Built for those who move without noise.",
};

const PILLARS = [
  {
    number: "01",
    heading: "Silence",
    body: "We don't chase trends. We don't make noise. Every collection is a deliberate reduction — remove everything that isn't necessary until only the object remains.",
  },
  {
    number: "02",
    heading: "Construction",
    body: "Every seam, every panel, every stitch placement is intentional. We work with a small network of mills and factories that share our obsession with process over output.",
  },
  {
    number: "03",
    heading: "Longevity",
    body: "Fast fashion is a tax on your attention. We build pieces designed to outlast trends, seasons, and the algorithm. Buy less. Own better.",
  },
  {
    number: "04",
    heading: "Restraint",
    body: "Black. White. Gray. The absence of color is not a limitation — it is a commitment to form. When the palette is stripped away, the silhouette has nowhere to hide.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="pt-14">
        {/* — Hero Statement — */}
        <section className="border-b border-zinc-100 px-4 py-24 md:px-8 md:py-36">
          <div className="mx-auto max-w-screen-xl">
            <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.4em] text-zinc-400">
              About Spaceworm
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-tight text-black md:text-7xl lg:text-8xl">
              Built for the
              <br />
              Space Between.
            </h1>
          </div>
        </section>

        {/* — Origin — */}
        <section className="border-b border-zinc-100 px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                The Origin
              </p>
            </div>
            <div className="max-w-2xl">
              <p className="mb-6 text-2xl font-black uppercase leading-snug tracking-tight text-black md:text-3xl">
                Spaceworm started as a question: what would clothing look like if it had nothing to prove?
              </p>
              <p className="mb-4 text-sm leading-relaxed text-zinc-500">
                Founded in Lagos, we build garments at the intersection of utility and restraint.
                Not sportswear, not luxury — something that exists in the gap between the two.
                Designed for people who are already interesting. Clothes that don't try to make you something you're not.
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                The worm navigates dark space without light, without direction — guided only by its own momentum.
                That's the ethos. Move without needing to be seen. Let the work speak.
              </p>
            </div>
          </div>
        </section>

        {/* — Large editorial divider — */}
        <section className="border-b border-zinc-100 bg-black px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-screen-xl">
            <blockquote className="max-w-3xl">
              <p className="text-3xl font-black uppercase leading-tight tracking-tight text-white md:text-5xl">
                "The product is the statement. Everything else is just noise."
              </p>
              <footer className="mt-8 text-[10px] font-semibold uppercase tracking-[0.35em] text-zinc-500">
                — Spaceworm, Lagos 2025
              </footer>
            </blockquote>
          </div>
        </section>

        {/* — Pillars — */}
        <section className="border-b border-zinc-100 px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-screen-xl">
            <div className="mb-14 grid grid-cols-1 md:grid-cols-[1fr_2fr]">
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                What We Stand For
              </p>
            </div>
            <div className="grid grid-cols-1 gap-px border border-zinc-100 bg-zinc-100 sm:grid-cols-2">
              {PILLARS.map((p) => (
                <div key={p.number} className="bg-white px-8 py-10">
                  <p className="mb-6 text-[10px] font-black uppercase tracking-[0.35em] text-zinc-300">
                    {p.number}
                  </p>
                  <h3 className="mb-4 text-xl font-black uppercase tracking-tight text-black">
                    {p.heading}
                  </h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* — Process — */}
        <section className="border-b border-zinc-100 px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-12 md:grid-cols-[1fr_2fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-400">
                The Process
              </p>
            </div>
            <div className="max-w-2xl">
              <p className="mb-8 text-sm leading-relaxed text-zinc-500">
                Every Spaceworm piece begins with a problem statement, not a mood board.
                We ask: what does this garment need to do, and how do we remove everything that gets in the way of that function?
              </p>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  { step: "Research", desc: "Material sourcing, wear-testing, and functional analysis before a single sketch is drawn." },
                  { step: "Reduce", desc: "Every draft is challenged. If an element doesn't serve the structure, it's removed." },
                  { step: "Release", desc: "Small-batch drops. Never overproduced. Each piece is accounted for before it's made." },
                ].map((item) => (
                  <div key={item.step} className="border-t border-zinc-200 pt-4">
                    <p className="mb-2 text-xs font-black uppercase tracking-widest text-black">
                      {item.step}
                    </p>
                    <p className="text-xs leading-relaxed text-zinc-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* — CTA — */}
        <section className="px-4 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-screen-xl">
            <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
              <h2 className="max-w-lg text-4xl font-black uppercase leading-tight tracking-tight text-black md:text-5xl">
                Less talk.
                <br />
                More garment.
              </h2>
              <div className="flex gap-4">
                <Link
                  href="/all"
                  className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
                >
                  Shop Now
                </Link>
                <Link
                  href="mailto:hello@spaceworm.co"
                  className="inline-block border border-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-50"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer variant="compact" />
      </main>
    </>
  );
}
