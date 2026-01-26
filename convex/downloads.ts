import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const downloadToken = await ctx.db
      .query("downloadTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!downloadToken) {
      return { error: "Invalid download token" };
    }

    if (downloadToken.expiresAt < Date.now()) {
      return { error: "Download token has expired" };
    }

    if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
      return { error: "Download limit reached" };
    }

    const product = await ctx.db.get(downloadToken.productId);
    if (!product) {
      return { error: "Product not found" };
    }

    return {
      token: downloadToken,
      product,
    };
  },
});

export const getByOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const tokens = await ctx.db
      .query("downloadTokens")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    const tokensWithProducts = await Promise.all(
      tokens.map(async (token) => {
        const product = await ctx.db.get(token.productId);
        return {
          ...token,
          product,
        };
      })
    );

    return tokensWithProducts;
  },
});

export const incrementDownloadCount = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const downloadToken = await ctx.db
      .query("downloadTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!downloadToken) {
      throw new Error("Invalid download token");
    }

    if (downloadToken.expiresAt < Date.now()) {
      throw new Error("Download token has expired");
    }

    if (downloadToken.downloadCount >= downloadToken.maxDownloads) {
      throw new Error("Download limit reached");
    }

    await ctx.db.patch(downloadToken._id, {
      downloadCount: downloadToken.downloadCount + 1,
    });

    return { success: true };
  },
});

export const regenerateToken = mutation({
  args: { orderId: v.id("orders"), productId: v.id("products") },
  handler: async (ctx, args) => {
    // Find existing token
    const existingTokens = await ctx.db
      .query("downloadTokens")
      .withIndex("by_order", (q) => q.eq("orderId", args.orderId))
      .collect();

    const existingToken = existingTokens.find(
      (t) => t.productId === args.productId
    );

    const newToken = generateToken();
    const newExpiry = Date.now() + 48 * 60 * 60 * 1000;

    if (existingToken) {
      await ctx.db.patch(existingToken._id, {
        token: newToken,
        expiresAt: newExpiry,
        downloadCount: 0,
      });
    } else {
      await ctx.db.insert("downloadTokens", {
        orderId: args.orderId,
        productId: args.productId,
        token: newToken,
        expiresAt: newExpiry,
        downloadCount: 0,
        maxDownloads: 5,
      });
    }

    return { token: newToken };
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

export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.fileId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get a public URL for a storage file (used for preview images)
export const getStorageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
