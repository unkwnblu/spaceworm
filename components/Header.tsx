"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [
  { label: "New", href: "/#new" },
  { label: "Tops", href: "/#tops" },
  { label: "Bottoms", href: "/#bottoms" },
  { label: "Outerwear", href: "/#outerwear" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled ? "bg-white border-b border-zinc-200" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="text-sm font-black uppercase tracking-[0.2em] text-black"
          >
            Spaceworm
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-widest text-zinc-600 transition-colors hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Cart button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-zinc-600 hover:text-black"
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
              <span className="block h-px w-5 bg-black" />
              <span className="block h-px w-5 bg-black" />
              <span className="block h-px w-3 bg-black" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} links={NAV_LINKS} />
      <CartDrawer />
    </>
  );
}
