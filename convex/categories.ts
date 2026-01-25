import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();

    // Get product counts for each category
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const products = await ctx.db
          .query("products")
          .withIndex("by_category", (q) => q.eq("categoryId", category._id))
          .filter((q) => q.eq(q.field("isActive"), true))
          .collect();
        return {
          ...category,
          productCount: products.length,
        };
      })
    );

    return categoriesWithCounts;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingCategories = await ctx.db.query("categories").collect();
    if (existingCategories.length > 0) {
      return { message: "Categories already seeded" };
    }

    const categories = [
      {
        name: "Airbnb & Short-Term Rentals",
        slug: "airbnb-short-term-rentals",
        description: "Essential templates and tools for Airbnb hosts and short-term rental managers.",
      },
      {
        name: "Landlord Tools",
        slug: "landlord-tools",
        description: "Professional templates for property landlords to manage tenants and finances.",
      },
      {
        name: "Home Buying",
        slug: "home-buying",
        description: "Checklists and planners to guide you through the home buying journey.",
      },
      {
        name: "Realtor Marketing",
        slug: "realtor-marketing",
        description: "Marketing templates to help realtors stand out and attract clients.",
      },
      {
        name: "Realtor Tools",
        slug: "realtor-tools",
        description: "Professional tools and templates for real estate agents.",
      },
      {
        name: "Property Management",
        slug: "property-management",
        description: "Templates for efficient property maintenance and management.",
      },
      {
        name: "Home Improvement",
        slug: "home-improvement",
        description: "Planners and trackers for home renovation projects.",
      },
    ];

    for (const category of categories) {
      await ctx.db.insert("categories", category);
    }

    return { message: "Categories seeded successfully" };
  },
});
