import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    parentId: v.optional(v.id("categories")),
  })
    .index("by_slug", ["slug"])
    .index("by_parent", ["parentId"]),

  products: defineTable({
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    type: v.string(),
    price: v.number(),
    previewUrl: v.optional(v.string()),
    previewImageId: v.optional(v.id("_storage")), // Storage ID for preview image cleanup
    fileId: v.optional(v.id("_storage")),
    deliveryUrl: v.optional(v.string()), // For Canva links or external delivery URLs
    isActive: v.boolean(),
    isFeatured: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["categoryId"])
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

  settings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    mainImageId: v.optional(v.id("_storage")),
    mainImageUrl: v.optional(v.string()),
    isPublished: v.boolean(),

    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished", "createdAt"]),

});

