"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "convex/react";
import { CheckCircle, Download, Mail, ExternalLink } from "lucide-react";
import { api } from "../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface DownloadToken {
  _id: string;
  token: string;
  product?: {
    _id: string;
    name: string;
    fileId?: string;
    deliveryUrl?: string;
  } | null;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  const order = useQuery(
    api.orders.getByStripeSession,
    sessionId ? { stripeSessionId: sessionId } : "skip"
  );

  const downloadTokens = useQuery(
    api.downloads.getByOrder,
    order?._id ? { orderId: order._id } : "skip"
  );

  // Clear cart on successful checkout
  useEffect(() => {
    if (order?.status === "completed") {
      clearCart();
    }
  }, [order?.status, clearCart]);

  if (!sessionId) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Invalid session</h1>
        <p className="mt-2 text-muted-foreground">
          No checkout session found.
        </p>
        <Button asChild className="mt-8">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        <div className="text-center mb-8">
          <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order || order.status !== "completed") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 text-center">
        <div className="animate-pulse">
          <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4" />
          <h1 className="text-2xl font-semibold">Processing your order...</h1>
          <p className="mt-2 text-muted-foreground">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      {/* Success header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <h1 className="mt-4 font-serif text-3xl">Thank you for your order!</h1>
        <p className="mt-2 text-muted-foreground">
          Your download links have been sent to{" "}
          <span className="font-medium text-foreground">{order.email}</span>
        </p>
      </div>

      {/* Order details */}
      <div className="border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Order Details</h2>
          <span className="font-mono text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        <Separator className="mb-4" />

        <div className="flex justify-between mb-4">
          <span className="text-muted-foreground">Total paid</span>
          <span className="font-mono font-semibold">
            {formatPrice(order.total)}
          </span>
        </div>

        <Separator className="my-4" />

        {/* Download links */}
        <div>
          <h3 className="font-medium mb-4 flex items-center">
            <Download className="mr-2 h-4 w-4" />
            Your Downloads
          </h3>

          {downloadTokens === undefined ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : downloadTokens.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Download links are being generated...
            </p>
          ) : (
            <ul className="space-y-2">
              {downloadTokens.map((token: DownloadToken) => (
                <li
                  key={token._id}
                  className="flex items-center justify-between p-3 border border-border"
                >
                  <span className="text-sm font-medium">
                    {token.product?.name}
                  </span>
                  {token.product?.deliveryUrl ? (
                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={token.product.deliveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Open in Canva
                      </a>
                    </Button>
                  ) : token.product?.fileId ? (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/download/${token.token}`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Link>
                    </Button>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      File not available
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            Download links expire in 48 hours. Each file can be downloaded up to
            5 times.
          </p>
        </div>
      </div>

      {/* Email reminder */}
      <div className="mt-6 p-4 bg-muted/50 border border-border">
        <div className="flex items-start gap-3">
          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Check your email</p>
            <p className="text-sm text-muted-foreground">
              We&apos;ve sent a copy of your download links to {order.email}
            </p>
          </div>
        </div>
      </div>

      {/* Continue shopping */}
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="text-center mb-8">
        <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-64 mx-auto mb-2" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
