import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const bundles = await ctx.db
      .query("bundles")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    // Get product details for each bundle
    const bundlesWithProducts = await Promise.all(
      bundles.map(async (bundle) => {
        const products = await Promise.all(
          bundle.productIds.map((id) => ctx.db.get(id))
        );
        const validProducts = products.filter(Boolean);
        const originalPrice = validProducts.reduce(
          (sum, p) => sum + (p?.price ?? 0),
          0
        );
        return {
          ...bundle,
          products: validProducts,
          originalPrice,
          savings: originalPrice - bundle.price,
        };
      })
    );

    return bundlesWithProducts;
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const bundle = await ctx.db
      .query("bundles")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (!bundle) return null;

    const products = await Promise.all(
      bundle.productIds.map(async (id) => {
        const product = await ctx.db.get(id);
        if (!product) return null;
        const category = await ctx.db.get(product.categoryId);
        return { ...product, category };
      })
    );

    const validProducts = products.filter(Boolean);
    const originalPrice = validProducts.reduce(
      (sum, p) => sum + (p?.price ?? 0),
      0
    );

    return {
      ...bundle,
      products: validProducts,
      originalPrice,
      savings: originalPrice - bundle.price,
    };
  },
});

export const getById = query({
  args: { id: v.id("bundles") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.string(),
    productIds: v.array(v.id("products")),
    price: v.number(),
    discountPercent: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bundles", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("bundles"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    productIds: v.optional(v.array(v.id("products"))),
    price: v.optional(v.number()),
    discountPercent: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined)
    );
    await ctx.db.patch(id, filteredUpdates);
    return await ctx.db.get(id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingBundles = await ctx.db.query("bundles").collect();
    if (existingBundles.length > 0) {
      return { message: "Bundles already seeded" };
    }

    const products = await ctx.db.query("products").collect();
    const categories = await ctx.db.query("categories").collect();

    // Group products by category
    const productsByCategory = new Map<string, typeof products>();
    for (const category of categories) {
      const categoryProducts = products.filter(
        (p) => p.categoryId === category._id
      );
      productsByCategory.set(category.name, categoryProducts);
    }

    const bundles = [
      {
        name: "Airbnb Host Bundle",
        slug: "airbnb-host-bundle",
        description:
          "Everything you need to run a successful Airbnb business. Includes welcome guides, check-in instructions, house rules, and more.",
        category: "Airbnb & Short-Term Rentals",
        discountPercent: 35,
      },
      {
        name: "Landlord Toolkit",
        slug: "landlord-toolkit",
        description:
          "Complete toolkit for landlords featuring rental agreements, expense trackers, tenant screening forms, and more.",
        category: "Landlord Tools",
        discountPercent: 35,
      },
      {
        name: "Home Buyer's Starter Kit",
        slug: "home-buyers-starter-kit",
        description:
          "All the checklists and planners you need for your home buying journey, from budgeting to moving day.",
        category: "Home Buying",
        discountPercent: 30,
      },
      {
        name: "Realtor Marketing Pack",
        slug: "realtor-marketing-pack",
        description:
          "Professional marketing templates to elevate your real estate brand on social media and print.",
        category: "Realtor Marketing",
        discountPercent: 30,
      },
      {
        name: "Property Manager's Essentials",
        slug: "property-managers-essentials",
        description:
          "Essential tools for property managers including cleaning checklists, inspection forms, and maintenance logs.",
        category: "Property Management",
        discountPercent: 25,
      },
    ];

    for (const bundleData of bundles) {
      const categoryProducts = productsByCategory.get(bundleData.category) || [];
      if (categoryProducts.length === 0) continue;

      const originalPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0);
      const discountedPrice = Math.round(
        originalPrice * (1 - bundleData.discountPercent / 100)
      );

      await ctx.db.insert("bundles", {
        name: bundleData.name,
        slug: bundleData.slug,
        description: bundleData.description,
        productIds: categoryProducts.map((p) => p._id),
        price: discountedPrice,
        discountPercent: bundleData.discountPercent,
        isActive: true,
        createdAt: Date.now(),
      });
    }

    return { message: "Bundles seeded successfully" };
  },
});
