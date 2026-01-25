"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface BundleCardProps {
  bundle: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPercent: number;
    originalPrice: number;
    savings: number;
    products?: Array<{
      _id: string;
      name: string;
    }>;
  };
}

export function BundleCard({ bundle }: BundleCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: bundle._id,
      type: "bundle",
      name: bundle.name,
      price: bundle.price,
      originalPrice: bundle.originalPrice,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group"
    >
      <Link href={`/bundles/${bundle.slug}`} className="block">
        <div className="border border-border bg-card transition-all hover:border-accent/50 relative overflow-hidden">
          {/* Discount badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge variant="accent" className="text-sm font-semibold">
              Save {bundle.discountPercent}%
            </Badge>
          </div>

          {/* Preview area */}
          <div className="aspect-[16/9] bg-gradient-to-br from-accent/5 to-accent/10 p-8 flex items-center justify-center">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto text-accent mb-2" />
              <p className="text-sm font-medium">
                {bundle.products?.length || 0} Templates
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-semibold leading-tight group-hover:text-accent transition-colors">
              {bundle.name}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {bundle.description}
            </p>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <span className="font-mono text-2xl font-bold">
                  {formatPrice(bundle.price)}
                </span>
                <span className="ml-2 font-mono text-sm text-muted-foreground line-through">
                  {formatPrice(bundle.originalPrice)}
                </span>
              </div>
              <Button
                size="default"
                variant="accent"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Add Bundle
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
