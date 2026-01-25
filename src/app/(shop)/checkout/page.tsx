"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, ShoppingBag, Lock } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const { items, getTotal, getSavings, clearCart } = useCart();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = getTotal();
  const savings = getSavings();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe && data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-24 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <h1 className="mt-4 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some templates to get started.
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      {/* Back link */}
      <nav className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Link>
      </nav>

      <h1 className="font-serif text-3xl mb-8">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order form */}
        <div className="lg:col-span-3">
          <form onSubmit={handleCheckout}>
            <div className="border border-border p-6">
              <h2 className="text-lg font-medium mb-4">Contact Information</h2>
              <p className="text-sm text-muted-foreground mb-4">
                We'll send your download links to this email address.
              </p>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mb-4"
              />
            </div>

            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              variant="accent"
              className="w-full mt-6"
              disabled={loading || !email}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay {formatPrice(total)}
                </>
              )}
            </Button>

            <p className="mt-4 text-xs text-center text-muted-foreground">
              Secure checkout powered by Stripe
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="border border-border p-6 sticky top-24">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {item.type} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-mono text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <Separator className="my-4" />

            {savings > 0 && (
              <div className="flex justify-between text-sm text-accent mb-2">
                <span>Bundle Savings</span>
                <span className="font-mono">-{formatPrice(savings)}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="font-mono">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
