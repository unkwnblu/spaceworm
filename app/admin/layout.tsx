"use client";

import { useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminLayoutContext } from "@/context/AdminLayoutContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminLayoutContext.Provider
      value={{ onMenuOpen: () => setMobileMenuOpen(true) }}
    >
      <div className="flex h-screen overflow-hidden bg-zinc-950">
        <AdminSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />
        <div className="flex flex-1 flex-col overflow-hidden bg-zinc-50">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
