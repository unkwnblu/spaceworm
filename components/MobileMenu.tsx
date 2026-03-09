"use client";

import { useEffect } from "react";
import Link from "next/link";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
};

export default function MobileMenu({ isOpen, onClose, links }: Props) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={onClose}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-6">
          <span className="text-sm font-black uppercase tracking-[0.2em]">Spaceworm</span>
          <button onClick={onClose} aria-label="Close menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col py-8">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="border-b border-zinc-100 px-6 py-5 text-xs font-black uppercase tracking-[0.3em] text-black hover:bg-zinc-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
