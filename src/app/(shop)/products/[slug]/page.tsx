"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import Image from "next/image";
import { ArrowLeft, Check, ShoppingBag } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = useQuery(api.products.getBySlug, { slug });
  const { addItem } = useCart();

  if (product === undefined) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <Skeleton className="aspect-square" />
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

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">
          The product you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      type: "product",
      name: product.name,
      price: product.price,
    });
  };

  const benefits = [
    "Instant digital download",
    "Professional design",
    "Easy to customize",
    "Print-ready format",
    "Lifetime access",
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Preview */}
        <div className="border border-border">
          <div className="aspect-square bg-muted/50 flex items-center justify-center relative overflow-hidden">
            {product.previewUrl ? (
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center p-8">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                  Preview
                </p>
                <p className="text-lg font-medium">{product.type}</p>
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {product.category && (
            <Link href={`/categories/${product.category.slug}`}>
              <Badge variant="secondary" className="mb-4">
                {product.category.name}
              </Badge>
            </Link>
          )}

          <h1 className="font-serif text-3xl sm:text-4xl">{product.name}</h1>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-6">
            <span className="font-mono text-3xl font-bold">
              {formatPrice(product.price)}
            </span>
          </div>

          <Separator className="my-6" />

          <Button size="xl" variant="accent" onClick={handleAddToCart} className="w-full sm:w-auto">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>

          <Separator className="my-6" />

          {/* Benefits */}
          <div>
            <h3 className="font-medium mb-4">What you&apos;ll get:</h3>
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center text-sm">
                  <Check className="mr-3 h-4 w-4 text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Product type */}
          <div className="mt-8 p-4 border border-border bg-muted/30">
            <p className="text-sm">
              <span className="font-medium">Type:</span>{" "}
              <span className="text-muted-foreground">{product.type}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
