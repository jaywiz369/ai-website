"use client";

import Link from "next/link";
import { ArrowRight, FileText, Package, Sparkles, Zap } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";

const features = [
  {
    icon: Sparkles,
    title: "Battle-Tested Prompts",
    description: "Crafted and refined through thousands of generations.",
  },
  {
    icon: Zap,
    title: "Instant Download",
    description: "Get your prompts immediately after purchase.",
  },
  {
    icon: Package,
    title: "Premium Support",
    description: "Get help from our experts anytime you need it.",
  },
];

export default function HomePage() {
  const featuredProducts = useQuery(api.products.getFeatured, { limit: 6 });
  const categories = useQuery(api.categories.getTopLevel);
  const branding = useQuery(api.settings.getBranding);

  const heroHeadline = branding?.heroHeadline ?? "Premium Prompts for AI Power Users";
  const heroDescription = branding?.heroDescription ?? "Curated prompt packs and automation tools to supercharge your AI workflow. Battle-tested, ready to use.";
  const ctaHeadline = branding?.ctaHeadline ?? "Ready to supercharge your AI workflow?";
  const ctaDescription = branding?.ctaDescription ?? "Join thousands of creators using our premium prompts.";

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b border-border overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        {/* Decorative glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient">{heroHeadline}</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              {heroDescription}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="xl" className="w-full sm:w-auto bg-primary text-primary-foreground hover:glow-md transition-all px-8 py-6 rounded-full text-lg font-bold" asChild>
                <Link href="#categories">
                  Explore Collections
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" className="w-full sm:w-auto border-border/50 hover:border-primary/50 hover:bg-primary/5 px-8 py-6 rounded-full text-lg font-medium backdrop-blur-sm" asChild>
                <Link href="/blog">Read Our Guide</Link>
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
              <div key={feature.title} className="flex items-start gap-4 group">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{feature.title}</h3>
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
              <h2 className="font-display text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-muted-foreground">
                Our most popular prompt packs and tools.
              </p>
            </div>
            <Button variant="ghost" asChild className="hidden sm:flex nav-glow">
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


      {/* Categories */}
      {categories && categories.length > 0 && (
        <section id="categories" className="py-16 lg:py-24 scroll-mt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-bold">Browse by Category</h2>
              <p className="mt-2 text-muted-foreground">
                Find the perfect prompts for your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/categories/${category.slug}`}
                  className="group relative rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:glow-sm"
                >
                  <h3 className="font-display font-semibold group-hover:text-primary transition-colors">
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
      <section className="relative border-t border-border bg-card py-16 lg:py-24 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">
              <span className="text-gradient">{ctaHeadline}</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              {ctaDescription}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 glow-sm hover:glow-md transition-shadow"
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
