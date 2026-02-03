"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type AdminDataContextType = {
  storeName: string;
  isLoading: boolean;
};

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const branding = useQuery(api.settings.getBranding);
  const storeName = branding?.storeName ?? "Admin";
  const isLoading = branding === undefined;

  return (
    <AdminDataContext.Provider value={{ storeName, isLoading }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
