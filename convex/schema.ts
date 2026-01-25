import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  }).index("by_slug", ["slug"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    type: v.string(),
    price: v.number(),
    previewUrl: v.optional(v.string()),
    fileId: v.optional(v.id("_storage")),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
    .index("by_active", ["isActive"]),

  bundles: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    productIds: v.array(v.id("products")),
    price: v.number(),
    discountPercent: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"]),

  orders: defineTable({
    userId: v.optional(v.string()),
    email: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed")
    ),
    total: v.number(),
    stripeSessionId: v.string(),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_stripe_session", ["stripeSessionId"]),

  orderItems: defineTable({
    orderId: v.id("orders"),
    productId: v.optional(v.id("products")),
    bundleId: v.optional(v.id("bundles")),
    price: v.number(),
  }).index("by_order", ["orderId"]),

  downloadTokens: defineTable({
    orderId: v.id("orders"),
    productId: v.id("products"),
    token: v.string(),
    expiresAt: v.number(),
    downloadCount: v.number(),
    maxDownloads: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_order", ["orderId"]),
});
