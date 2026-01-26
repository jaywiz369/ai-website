"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  productCount?: number;
}

export default function CategoriesPage() {
  const categories = useQuery(api.categories.list) as Category[] | undefined;

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Categories</h1>
        <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
          Browse prompts by category to find exactly what you need.
        </p>
      </div>

      {/* Categories Grid */}
      {categories === undefined ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category: Category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug}`}
              className="group rounded-lg border border-border bg-card p-8 transition-all duration-300 hover:border-primary/50 hover:glow-sm"
            >
              <h2 className="font-display text-xl font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-medium">
                  {category.productCount} products
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
