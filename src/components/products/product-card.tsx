"use client";

import Link from "next/link";
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
        <div className="border border-border bg-card transition-all hover:border-foreground/20">
          {/* Preview area */}
          <div className="aspect-[4/3] bg-muted/50 p-8 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                {product.type}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {product.category && (
              <Badge variant="secondary" className="mb-2 text-xs">
                {product.category.name}
              </Badge>
            )}
            <h3 className="font-medium leading-tight group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-lg font-semibold">
                {formatPrice(product.price)}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
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
