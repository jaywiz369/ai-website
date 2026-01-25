import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Parse the items from metadata
      const itemsData = JSON.parse(session.metadata?.items || "[]");

      // Create order in Convex
      await convex.mutation(api.orders.create, {
        email: session.customer_email || "",
        total: session.amount_total || 0,
        stripeSessionId: session.id,
        items: itemsData.map((item: any) => ({
          productId: item.type === "product" ? item.id : undefined,
          bundleId: item.type === "bundle" ? item.id : undefined,
          price: item.price * item.quantity,
        })),
      });

      // Note: The order completion and download token generation
      // is handled by the Convex internal mutation completeOrder
      // which should be called after order creation

    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Error processing order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
