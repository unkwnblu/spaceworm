"use client";

import { createContext, useContext } from "react";

type AdminLayoutContextType = { onMenuOpen: () => void };

export const AdminLayoutContext = createContext<AdminLayoutContextType>({
  onMenuOpen: () => {},
});

export function useAdminLayout() {
  return useContext(AdminLayoutContext);
}
