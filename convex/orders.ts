import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const create = mutation({
  args: {
    email: v.string(),
    total: v.number(),
    stripeSessionId: v.string(),
    items: v.array(
      v.object({
        productId: v.optional(v.id("products")),
        price: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const orderId = await ctx.db.insert("orders", {
      email: args.email,
      status: "pending",
      total: args.total,
      stripeSessionId: args.stripeSessionId,
      createdAt: Date.now(),
    });

    for (const item of args.items) {
      await ctx.db.insert("orderItems", {
        orderId,
        productId: item.productId,
        price: item.price,
      });
    }

    return orderId;
  },
});

export const getByStripeSession = query({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .first();
  },
});

export const getById = query({
  args: { id: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.id);
    if (!order) return null;

    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", args.id))
      .collect();

    const itemsWithDetails = await Promise.all(
      items.map(async (item) => {
        let product = null;

        if (item.productId) {
          product = await ctx.db.get(item.productId);
        }

        return {
          ...item,
          product,
        };
      })
    );

    return {
      ...order,
      items: itemsWithDetails,
    };
  },
});

export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("orders")
      .order("desc")
      .collect();
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});

export const completeOrder = internalMutation({
  args: { stripeSessionId: v.string() },
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_stripe_session", (q) =>
        q.eq("stripeSessionId", args.stripeSessionId)
      )
      .first();

    if (!order) {
      throw new Error("Order not found");
    }

    await ctx.db.patch(order._id, { status: "completed" });

    // Get order items
    const items = await ctx.db
      .query("orderItems")
      .withIndex("by_order", (q) => q.eq("orderId", order._id))
      .collect();

    // Generate download tokens for each product
    const productIds: string[] = [];

    for (const item of items) {
      if (item.productId) {
        productIds.push(item.productId);
      }
    }

    // Create unique download tokens
    const uniqueProductIds = [...new Set(productIds)];
    for (const productId of uniqueProductIds) {
      const token = generateToken();
      await ctx.db.insert("downloadTokens", {
        orderId: order._id,
        productId: productId as any,
        token,
        expiresAt: Date.now() + 48 * 60 * 60 * 1000, // 48 hours
        downloadCount: 0,
        maxDownloads: 5,
      });
    }

    return order._id;
  },
});

function generateToken(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
