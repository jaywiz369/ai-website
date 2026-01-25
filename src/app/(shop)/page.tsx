"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, FileText, Package, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";
import { BundleCard } from "@/components/bundles/bundle-card";

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

interface Category {
  _id: string;
  name: string;
  slug: string;
  productCount?: number;
}

const features = [
  {
    icon: FileText,
    title: "Professional Templates",
    description: "Designed by real estate professionals for real results.",
  },
  {
    icon: Zap,
    title: "Instant Download",
    description: "Get your templates immediately after purchase.",
  },
  {
    icon: Package,
    title: "Bundle & Save",
    description: "Get complete toolkits at up to 35% off.",
  },
];

export default function HomePage() {
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 6 });
  const bundles = useQuery(api.bundles.list);
  const categories = useQuery(api.categories.list);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl lg:text-6xl">
              Templates for{" "}
              <span className="text-accent">Real Estate</span>{" "}
              Professionals
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Premium digital templates, checklists, and guides for Airbnb hosts,
              landlords, realtors, and home buyers. Streamline your business today.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="xl" variant="accent" asChild>
                <Link href="/products">
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link href="/bundles">View Bundles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular templates for real estate professionals.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex">
              <Link href="/products">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ProductGrid
            products={featuredProducts || []}
            loading={featuredProducts === undefined}
          />

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Bundles */}
      {bundles && bundles.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl">Bundle & Save</h2>
              <p className="mt-2 text-muted-foreground">
                Get complete toolkits at discounted prices.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {bundles.slice(0, 4).map((bundle: Bundle) => (
                <BundleCard key={bundle._id} bundle={bundle} />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button variant="outline" asChild>
                <Link href="/bundles">
                  View All Bundles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl">Browse by Category</h2>
              <p className="mt-2 text-muted-foreground">
                Find the perfect templates for your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category: Category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group border border-border p-6 transition-all hover:border-foreground/20 hover:bg-muted/50"
                >
                  <h3 className="font-medium group-hover:text-accent transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {category.productCount} products
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border bg-foreground text-background py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl sm:text-4xl">
              Ready to streamline your business?
            </h2>
            <p className="mt-4 text-background/70">
              Join thousands of real estate professionals using our templates.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <Link href="/products">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
