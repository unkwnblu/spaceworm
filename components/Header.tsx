"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "All", href: "/all" },
  { label: "Drops", href: "/drops" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalItems } = useCart();
  const pathname = usePathname();

  // Only use the transparent-over-hero treatment on the homepage
  const isHome = pathname === "/";
  const dark = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          dark ? "bg-white border-b border-zinc-200" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${dark ? "text-black" : "text-white"}`}
          >
            Spaceworm
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative text-xs font-semibold uppercase tracking-widest transition-colors after:absolute after:bottom-0 after:left-0 after:h-px after:transition-all after:duration-200 after:content-[''] ${
                  dark
                    ? `after:bg-black ${active ? "text-black after:w-full" : "text-zinc-600 hover:text-black after:w-0 hover:after:w-full"}`
                    : `after:bg-white ${active ? "text-white after:w-full" : "text-white/80 hover:text-white after:w-0 hover:after:w-full"}`
                }`}
              >
                {link.label}
              </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button
              onClick={openCart}
              className={`relative flex items-center gap-1 text-xs font-semibold uppercase tracking-widest transition-colors ${dark ? "text-zinc-600 hover:text-black" : "text-white/80 hover:text-white"}`}
              aria-label="Open cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="flex h-4 w-4 items-center justify-center bg-black text-[10px] font-bold text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex flex-col gap-[5px] md:hidden"
              aria-label="Open menu"
            >
              <span className={`block h-px w-5 transition-colors ${dark ? "bg-black" : "bg-white"}`} />
              <span className={`block h-px w-5 transition-colors ${dark ? "bg-black" : "bg-white"}`} />
              <span className={`block h-px w-3 transition-colors ${dark ? "bg-black" : "bg-white"}`} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
      <CartDrawer />
    </>
  );
}
