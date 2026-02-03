"use client";

import { createContext, useContext, ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

type Branding = {
  storeName: string;
  storeTagline: string;
  heroHeadline: string;
  heroDescription: string;
  ctaHeadline: string;
  ctaDescription: string;
  metaTitle: string;
  metaDescription: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
};

type SiteDataContextType = {
  branding: Branding | undefined;
  categories: Category[] | undefined;
  isLoading: boolean;
};

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const branding = useQuery(api.settings.getBranding);
  const categories = useQuery(api.categories.getTopLevel);

  const isLoading = branding === undefined || categories === undefined;

  return (
    <SiteDataContext.Provider value={{ branding, categories, isLoading }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (context === undefined) {
    throw new Error("useSiteData must be used within a SiteDataProvider");
  }
  return context;
}

export function useBranding() {
  const { branding, isLoading } = useSiteData();
  return { branding, isLoading };
}

export function useCategories() {
  const { categories, isLoading } = useSiteData();
  return { categories, isLoading };
}
