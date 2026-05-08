import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />

        {/* Editorial strip */}
        <section className="border-t border-zinc-100 py-20">
          <div className="mx-auto max-w-screen-xl px-4 md:px-8">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
              {/* Editorial image */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                <Image
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&q=80"
                  alt="Spaceworm editorial"
                  fill
                  className="object-cover grayscale"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>

              {/* Copy */}
              <div className="flex flex-col justify-center">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
                  The Manifesto
                </p>
                <h2 className="mb-6 text-4xl font-black uppercase leading-none tracking-tight text-black md:text-5xl">
                  Built for
                  <br />
                  the Space
                  <br />
                  Between.
                </h2>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-zinc-500">
                  Spaceworm exists in the gap between streetwear and technical wear.
                  Every piece is designed to outlast the trend cycle — functional,
                  durable, and relentlessly clean.
                </p>
                <div className="flex gap-4">
                  <a
                    href="/#products"
                    className="inline-block bg-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-white transition-colors hover:bg-zinc-800"
                  >
                    Shop Now
                  </a>
                  <a
                    href="/about"
                    className="inline-block border border-black px-8 py-4 text-xs font-black uppercase tracking-[0.25em] text-black transition-colors hover:bg-zinc-50"
                  >
                    Our Story
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
