"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const category = useQuery(api.categories.getBySlug, { slug });
  const products = useQuery(api.products.list, { categorySlug: slug });

  if (category === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <ProductGrid products={[]} loading={true} />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Category not found</h1>
        <p className="mt-2 text-muted-foreground">
          The category you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/categories"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          All Categories
        </Link>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">{category.description}</p>
      </div>

      {/* Results count */}
      <div className="mb-6 text-sm text-muted-foreground">
        {products?.length ?? 0} product{products?.length !== 1 ? "s" : ""}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products || []} loading={products === undefined} />
    </div>
  );
}
