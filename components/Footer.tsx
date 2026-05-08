import Link from "next/link";

type Props = {
  /** Show the full 4-column footer (default) or the compact single-row version */
  variant?: "full" | "compact";
};

export default function Footer({ variant = "full" }: Props) {
  if (variant === "compact") {
    return (
      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-widest text-zinc-400 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Spaceworm. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/all" className="hover:text-black">Shop</Link>
              <Link href="/about" className="hover:text-black">About</Link>
              <Link href="/privacy" className="hover:text-black">Privacy</Link>
              <Link href="/terms" className="hover:text-black">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
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
              links: [
                { label: "New Arrivals", href: "/all?sort=new" },
                { label: "Tops", href: "/all?category=Tops" },
                { label: "Bottoms", href: "/all?category=Bottoms" },
                { label: "Outerwear", href: "/all?category=Outerwear" },
                { label: "Accessories", href: "/all?category=Accessories" },
              ],
            },
            {
              heading: "Help",
              links: [
                { label: "Sizing Guide", href: "/sizing" },
                { label: "Shipping", href: "/terms" },
                { label: "Returns", href: "/terms" },
                { label: "FAQ", href: "/terms" },
                { label: "Contact", href: "mailto:hello@spaceworm.co" },
              ],
            },
            {
              heading: "Brand",
              links: [
                { label: "About", href: "/about" },
                { label: "Drops", href: "/drops" },
                { label: "Events", href: "/events" },
                { label: "Instagram", href: "https://instagram.com/spaceworm", external: true },
                { label: "Press", href: "mailto:press@spaceworm.co", external: true },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <p className="mb-4 text-[10px] font-black uppercase tracking-[0.3em]">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-zinc-400 transition-colors hover:text-black"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-xs text-zinc-400 transition-colors hover:text-black"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-100 pt-8 text-[10px] uppercase tracking-widest text-zinc-400 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Spaceworm. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-black">Privacy</Link>
            <Link href="/terms" className="hover:text-black">Terms</Link>
            <Link href="/cookies" className="hover:text-black">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
