import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";

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
              {/* Editorial image placeholder */}
              <div className="relative aspect-[4/5] w-full bg-zinc-100">
                {/*
                  Replace with:
                  <Image src="/editorial.jpg" alt="Spaceworm editorial" fill className="object-cover" />
                */}
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

        {/* Footer */}
        <footer className="border-t border-zinc-200 bg-white">
          <div className="mx-auto max-w-screen-xl px-4 py-12 md:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div>
                <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]">
                  Spaceworm
                </p>
                <p className="text-xs leading-relaxed text-zinc-400">
                  Premium streetwear.
                  <br />
                  Uncompromising design.
                </p>
              </div>

              {[
                {
                  heading: "Shop",
                  links: ["New Arrivals", "Tops", "Bottoms", "Outerwear", "Accessories"],
                },
                {
                  heading: "Help",
                  links: ["Sizing Guide", "Shipping", "Returns", "FAQ", "Contact"],
                },
                {
                  heading: "Brand",
                  links: ["About", "Sustainability", "Careers", "Instagram", "Press"],
                },
              ].map((col) => (
                <div key={col.heading}>
                  <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]">
                    {col.heading}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {col.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-xs text-zinc-400 transition-colors hover:text-black"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 text-[10px] uppercase tracking-widest text-zinc-400 md:flex-row">
              <p>© {new Date().getFullYear()} Spaceworm. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#" className="hover:text-black">Privacy</a>
                <a href="#" className="hover:text-black">Terms</a>
                <a href="#" className="hover:text-black">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
