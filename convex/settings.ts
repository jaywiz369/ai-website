import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const setting = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();
    return setting?.value ?? null;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const result: { [key: string]: string } = {};
    for (const setting of settings) {
      result[setting.key] = setting.value;
    }
    return result;
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("settings", { key: args.key, value: args.value });
    }
  },
});

// Default branding values
const brandingDefaults = {
  storeName: "AgenticVault",
  storeTagline: "AI Agents & Engineering Tools",
  heroHeadline: "The Vault for AI Engineers",
  heroDescription: "Premium prompt packs, autonomous agents, and automation workflows. Built for developers building the future.",
  ctaHeadline: "Ready to ship faster?",
  ctaDescription: "Join thousands of AI engineers using our premium tools.",
  metaTitle: "AgenticVault.dev | AI Agents & Tools",
  metaDescription: "The vault for AI engineers. Premium prompt packs, autonomous agents, and automation tools.",
};

export const getBranding = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("settings").collect();
    const settingsMap: { [key: string]: string } = {};
    for (const setting of settings) {
      settingsMap[setting.key] = setting.value;
    }

    // Return settings with defaults
    return {
      storeName: settingsMap.storeName ?? brandingDefaults.storeName,
      storeTagline: settingsMap.storeTagline ?? brandingDefaults.storeTagline,
      heroHeadline: settingsMap.heroHeadline ?? brandingDefaults.heroHeadline,
      heroDescription: settingsMap.heroDescription ?? brandingDefaults.heroDescription,
      ctaHeadline: settingsMap.ctaHeadline ?? brandingDefaults.ctaHeadline,
      ctaDescription: settingsMap.ctaDescription ?? brandingDefaults.ctaDescription,
      metaTitle: settingsMap.metaTitle ?? brandingDefaults.metaTitle,
      metaDescription: settingsMap.metaDescription ?? brandingDefaults.metaDescription,
    };
  },
});

export const updateBranding = mutation({
  args: {
    storeName: v.optional(v.string()),
    storeTagline: v.optional(v.string()),
    heroHeadline: v.optional(v.string()),
    heroDescription: v.optional(v.string()),
    ctaHeadline: v.optional(v.string()),
    ctaDescription: v.optional(v.string()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const keys = Object.keys(args) as (keyof typeof args)[];

    for (const key of keys) {
      const value = args[key];
      if (value !== undefined) {
        const existing = await ctx.db
          .query("settings")
          .withIndex("by_key", (q) => q.eq("key", key))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, { value });
        } else {
          await ctx.db.insert("settings", { key, value });
        }
      }
    }
  },
});
