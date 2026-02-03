import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

interface CartItem {
  id: string;
  type: "product" | "bundle";
  name: string;
  price: number;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, email } = body as { items: CartItem[]; email: string };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: `${item.type === "bundle" ? "Bundle" : "Template"} - Digital Download`,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    // Calculate total
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // If total is 0, bypass Stripe and create a free order
    if (total === 0) {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../../../convex/_generated/api");
      const { resend } = await import("@/lib/resend");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

      const orderId = await convex.mutation(api.orders.createFreeOrder, {
        email,
        total: 0,
        items: items.map((item) => ({
          productId: item.id as any,
          price: 0,
        })),
      });

      // Fetch the generated download tokens to include in the email
      const tokens = await convex.query(api.downloads.getByOrder, { orderId });

      // Send confirmation email
      if (process.env.RESEND_API_KEY) {
        try {
          const { ReceiptEmail } = await import("@/emails/receipt");

          await resend.emails.send({
            from: "Orders <orders@resend.dev>", // Replace with your verified domain in production
            to: email,
            subject: "Your Free Downloads are Ready!",
            react: ReceiptEmail({
              orderId,
              email,
              tokens,
              appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
            }),
          });
        } catch (emailError) {
          console.error("Failed to send email:", emailError);
          // Don't fail the checkout if email fails
        }
      } else {
        console.warn("Skipping email: RESEND_API_KEY not set");
      }

      return NextResponse.json({
        sessionId: null,
        url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${orderId}`,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: email,
      metadata: {
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            type: item.type,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
      },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
