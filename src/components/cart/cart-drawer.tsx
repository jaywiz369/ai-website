"use client";

import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotal,
    getSavings,
  } = useCart();

  const total = getTotal();
  const savings = getSavings();

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
            <div className="text-center">
              <p className="text-lg font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add some templates to get started
              </p>
            </div>
            <Button onClick={closeCart} asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium leading-tight">
                          {item.name}
                        </h4>
                        <p className="mt-1 text-xs text-muted-foreground capitalize">
                          {item.type}
                        </p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="mt-1 text-xs text-accent">
                            Save {formatPrice(item.originalPrice - item.price)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium">
                          {formatPrice(item.price)}
                        </p>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <p className="font-mono text-xs text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-mono text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-4">
              {savings > 0 && (
                <div className="mb-2 flex justify-between text-sm text-accent">
                  <span>Bundle Savings</span>
                  <span className="font-mono">-{formatPrice(savings)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="font-mono">{formatPrice(total)}</span>
              </div>

              <Separator className="my-4" />

              <SheetFooter className="flex-col gap-2 sm:flex-col">
                <Button
                  className="w-full"
                  size="lg"
                  variant="accent"
                  asChild
                >
                  <Link href="/checkout" onClick={closeCart}>
                    Checkout
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continue Shopping
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
