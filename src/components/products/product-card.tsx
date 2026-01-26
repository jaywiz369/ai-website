"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    type: string;
    price: number;
    previewUrl?: string;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product._id,
      type: "product",
      name: product.name,
      price: product.price,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="rounded-lg border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:glow-sm">
          {/* Preview area */}
          <div className="aspect-[4/3] bg-muted/30 relative overflow-hidden rounded-t-lg">
            {product.previewUrl ? (
              <Image
                src={product.previewUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-8 bg-grid-dense opacity-60">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-display">
                    {product.type}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {product.category && (
              <Badge variant="secondary" className="mb-2 text-xs bg-primary/10 text-primary border-0">
                {product.category.name}
              </Badge>
            )}
            <h3 className="font-display font-semibold leading-tight group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-lg font-semibold text-primary">
                {formatPrice(product.price)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="opacity-0 group-hover:opacity-100 transition-all border-border hover:border-primary/50 hover:bg-primary/5"
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
