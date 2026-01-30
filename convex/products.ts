import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {
    categorySlug: v.optional(v.string()),
    search: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Filter by category
    if (args.categorySlug) {
      const categorySlug = args.categorySlug;
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", categorySlug))
        .first();

      if (category) {
        products = products.filter((p) => p.categoryId === category._id);
      }
    }

    // Filter by search term
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Filter by type
    if (args.type) {
      products = products.filter((p) => p.type === args.type);
    }

    // Get category info for each product
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return {
          ...product,
          category,
        };
      })
    );

    return productsWithCategory;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!product) return null;

    const category = await ctx.db.get(product.categoryId);
    return {
      ...product,
      category,
    };
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeatured = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const products = await ctx.db
      .query("products")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .take(limit);

    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return {
          ...product,
          category,
        };
      })
    );

    return productsWithCategory;
  },
});

export const getTypes = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products").collect();
    const types = [...new Set(products.map((p) => p.type))];
    return types.sort();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    categoryId: v.id("categories"),
    type: v.string(),
    price: v.number(),
    previewUrl: v.optional(v.string()),
    previewImageId: v.optional(v.id("_storage")),
    fileId: v.optional(v.id("_storage")),
    deliveryUrl: v.optional(v.string()),
    isActive: v.boolean(),
    isFeatured: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    type: v.optional(v.string()),
    price: v.optional(v.number()),
    previewUrl: v.optional(v.string()),
    previewImageId: v.optional(v.id("_storage")),
    fileId: v.optional(v.id("_storage")),
    deliveryUrl: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    clearPreviewImage: v.optional(v.boolean()), // Flag to clear preview image
    clearDeliveryUrl: v.optional(v.boolean()), // Flag to clear delivery URL
  },
  handler: async (ctx, args) => {
    const { id, clearPreviewImage, clearDeliveryUrl, ...updates } = args;

    // Get existing product to check for old preview image
    const existingProduct = await ctx.db.get(id);

    // If updating preview image or clearing it, delete the old one from storage
    if (existingProduct?.previewImageId) {
      const isNewImage = updates.previewImageId && updates.previewImageId !== existingProduct.previewImageId;
      if (isNewImage || clearPreviewImage) {
        await ctx.storage.delete(existingProduct.previewImageId);
      }
    }

    // If clearing preview image, set both fields to undefined
    if (clearPreviewImage) {
      await ctx.db.patch(id, {
        previewUrl: undefined,
        previewImageId: undefined,
      });
    }

    // If clearing delivery URL, set it to undefined
    if (clearDeliveryUrl) {
      await ctx.db.patch(id, {
        deliveryUrl: undefined,
      });
    }

    // If only clearing fields without other updates, return early
    if ((clearPreviewImage || clearDeliveryUrl) && Object.keys(updates).length === 0) {
      return await ctx.db.get(id);
    }

    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    // Get product to check for preview image
    const product = await ctx.db.get(args.id);

    // Delete preview image from storage if exists
    if (product?.previewImageId) {
      await ctx.storage.delete(product.previewImageId);
    }

    // Delete the product
    await ctx.db.delete(args.id);
  },
});

export const listAll = query({
  args: {
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("products").collect();

    // Filter by search term if provided
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      );
    }

    // Get category info for each product
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        const category = await ctx.db.get(product.categoryId);
        return {
          ...product,
          category,
        };
      })
    );

    return productsWithCategory;
  },
});


