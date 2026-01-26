"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { BundleCard } from "@/components/bundles/bundle-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Bundle {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPercent: number;
  originalPrice: number;
  savings: number;
  products?: { _id: string; name: string }[];
}

export default function BundlesPage() {
  const bundles = useQuery(api.bundles.list) as Bundle[] | undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Prompt Bundles</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Get complete prompt collections at discounted prices. Each bundle includes
          curated prompts optimized for specific workflows.
        </p>
      </div>

      {/* Bundles Grid */}
      {bundles === undefined ? (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-border">
              <Skeleton className="aspect-[16/9]" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bundles available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {bundles.map((bundle: Bundle) => (
            <BundleCard key={bundle._id} bundle={bundle} />
          ))}
        </div>
      )}
    </div>
  );
}
