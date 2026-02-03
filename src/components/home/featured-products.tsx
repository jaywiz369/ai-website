"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/product-grid";

export function FeaturedProducts() {
    const featuredProducts = useQuery(api.products.getFeatured, { limit: 6 });

    return (
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
    );
}
