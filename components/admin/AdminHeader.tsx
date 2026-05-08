"use client";

import { useAdminLayout } from "@/context/AdminLayoutContext";

type Props = {
  title: string;
  breadcrumb?: string;
};

export default function AdminHeader({ title, breadcrumb }: Props) {
  const { onMenuOpen } = useAdminLayout();

  return (
    <header className="flex h-14 flex-shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-6">
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuOpen}
          className="mr-1 flex flex-col gap-1 md:hidden"
          aria-label="Open menu"
        >
          <span className="h-0.5 w-5 bg-black" />
          <span className="h-0.5 w-5 bg-black" />
          <span className="h-0.5 w-5 bg-black" />
        </button>

        {breadcrumb && (
          <>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              {breadcrumb}
            </span>
            <span className="text-zinc-200">/</span>
          </>
        )}
        <h1 className="text-sm font-black uppercase tracking-widest text-black">
          {title}
        </h1>
      </div>
    </header>
  );
}
