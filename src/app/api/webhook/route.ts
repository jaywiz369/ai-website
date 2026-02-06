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

      // Create order in Convex - returns the orderId
      const orderId = await convex.mutation(api.orders.create, {
        email: session.customer_email || "",
        total: session.amount_total || 0,
        stripeSessionId: session.id,
        items: itemsData.map((item: any) => ({
          productId: item.id as any,
          price: (item.price || 0) * (item.quantity || 1),
        })),
      });

      // Complete the order and generate download tokens
      await convex.mutation(api.orders.completeOrder, {
        stripeSessionId: session.id,
      });

      // Fetch the generated download tokens to include in the email
      const tokens = await convex.query(api.downloads.getByOrder, { orderId });

      // Send confirmation email
      if (process.env.RESEND_API_KEY && session.customer_email) {
        try {
          const { resend } = await import("@/lib/resend");
          const { ReceiptEmail } = await import("@/emails/receipt");

          await resend.emails.send({
            from: "Orders <orders@resend.dev>", // Replace with verified domain in production
            to: session.customer_email,
            subject: "Your Digital Downloads are Ready!",
            react: ReceiptEmail({
              orderId,
              email: session.customer_email,
              tokens,
              appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Don't fail the webhook if email fails
        }
      } else if (!process.env.RESEND_API_KEY) {
        console.warn("Skipping email: RESEND_API_KEY not set");
      }

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
