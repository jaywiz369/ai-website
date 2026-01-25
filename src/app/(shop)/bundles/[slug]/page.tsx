"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { ArrowLeft, Check, Package, ShoppingBag } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface Product {
  _id: string;
  name: string;
  slug: string;
}

export default function BundleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const bundle = useQuery(api.bundles.getBySlug, { slug });
  const { addItem } = useCart();

  if (bundle === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-video" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Bundle not found</h1>
        <p className="mt-2 text-muted-foreground">
          The bundle you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/bundles">Browse Bundles</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: bundle._id,
      type: "bundle",
      name: bundle.name,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/bundles"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Bundles
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Preview */}
        <div className="border border-border">
          <div className="aspect-video bg-gradient-to-br from-accent/5 to-accent/10 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-16 w-16 mx-auto text-accent mb-4" />
              <p className="text-lg font-medium">
                {bundle.products?.length || 0} Templates Included
              </p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div>
          <Badge variant="accent" className="mb-4">
            Save {bundle.discountPercent}%
          </Badge>

          <h1 className="font-serif text-3xl sm:text-4xl">{bundle.name}</h1>

          <p className="mt-4 text-muted-foreground">{bundle.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-mono text-3xl font-bold">
              {formatPrice(bundle.price)}
            </span>
            <span className="font-mono text-lg text-muted-foreground line-through">
              {formatPrice(bundle.originalPrice)}
            </span>
            <span className="text-sm text-accent font-medium">
              Save {formatPrice(bundle.savings)}
            </span>
          </div>

          <Separator className="my-6" />

          <Button size="xl" variant="accent" onClick={handleAddToCart} className="w-full sm:w-auto">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add Bundle to Cart
          </Button>

          <Separator className="my-6" />

          {/* Included products */}
          <div>
            <h3 className="font-medium mb-4">
              Includes {bundle.products?.length || 0} templates:
            </h3>
            <ul className="space-y-3">
              {bundle.products?.map((product: Product | null) => (
                <li key={product?._id} className="flex items-center text-sm">
                  <Check className="mr-3 h-4 w-4 text-accent shrink-0" />
                  <Link
                    href={`/products/${product?.slug}`}
                    className="hover:text-accent transition-colors"
                  >
                    {product?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
