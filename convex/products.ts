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
      const category = await ctx.db
        .query("categories")
        .withIndex("by_slug", (q) => q.eq("slug", args.categorySlug))
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
      .filter((q) => q.eq(q.field("isActive"), true))
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
    fileId: v.optional(v.id("_storage")),
    isActive: v.boolean(),
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
    fileId: v.optional(v.id("_storage")),
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

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existingProducts = await ctx.db.query("products").collect();
    if (existingProducts.length > 0) {
      return { message: "Products already seeded" };
    }

    const categories = await ctx.db.query("categories").collect();
    const categoryMap = new Map(categories.map((c) => [c.name, c._id]));

    const products = [
      { id: 1, name: "Airbnb Thank You Card", description: "Professional thank you card template for Airbnb hosts to express gratitude to guests after their stay.", category: "Airbnb & Short-Term Rentals", type: "Card Template", price: 799 },
      { id: 2, name: "Airbnb Welcome Card", description: "Welcoming card template for Airbnb hosts to greet guests upon arrival with essential information.", category: "Airbnb & Short-Term Rentals", type: "Card Template", price: 799 },
      { id: 3, name: "Airbnb Welcome Guide Booklet", description: "Comprehensive welcome guide booklet template containing property information, house rules, local recommendations, and amenities for Airbnb guests.", category: "Airbnb & Short-Term Rentals", type: "Guide Booklet", price: 1499 },
      { id: 4, name: "Airbnb Welcome Sign", description: "Decorative welcome sign template for Airbnb properties to create a warm first impression for guests.", category: "Airbnb & Short-Term Rentals", type: "Signage", price: 599 },
      { id: 5, name: "Check-In Instructions", description: "Detailed check-in instructions template providing guests with step-by-step guidance for property access and arrival procedures.", category: "Airbnb & Short-Term Rentals", type: "Instructions Template", price: 899 },
      { id: 6, name: "Cleaning Checklist", description: "Comprehensive cleaning checklist template for property turnovers ensuring consistent cleanliness standards.", category: "Property Management", type: "Checklist", price: 699 },
      { id: 7, name: "Home Buying Budget Worksheet", description: "Financial planning worksheet template to help home buyers calculate and track their budget for purchasing a property.", category: "Home Buying", type: "Worksheet", price: 999 },
      { id: 8, name: "Home Improvement Project Planner", description: "Project planning template for organizing and tracking home improvement projects including timelines, budgets, and tasks.", category: "Home Improvement", type: "Planner", price: 1299 },
      { id: 9, name: "Home Showing Feedback Form", description: "Feedback form template for realtors to collect buyer impressions and comments after property showings.", category: "Realtor Tools", type: "Form Template", price: 599 },
      { id: 10, name: "Host Planner", description: "Comprehensive planner template for short-term rental hosts to manage bookings, guests, maintenance, and property operations.", category: "Airbnb & Short-Term Rentals", type: "Planner", price: 1499 },
      { id: 11, name: "House Hunting Checklist", description: "Organized checklist template for home buyers to evaluate and compare properties during the house hunting process.", category: "Home Buying", type: "Checklist", price: 799 },
      { id: 12, name: "House Rules", description: "House rules template for rental properties outlining guest expectations, policies, and property guidelines.", category: "Airbnb & Short-Term Rentals", type: "Rules Template", price: 699 },
      { id: 13, name: "Instagram Post - Realtor", description: "Social media post templates designed for realtors to market properties and build their brand on Instagram.", category: "Realtor Marketing", type: "Social Media Template", price: 1199 },
      { id: 14, name: "Instagram Stories - Realtor", description: "Instagram stories templates for realtors to showcase listings, share tips, and engage with potential clients.", category: "Realtor Marketing", type: "Social Media Template", price: 1199 },
      { id: 15, name: "Local Recommendation List", description: "Curated list template for hosts to share local restaurant, activity, and service recommendations with guests.", category: "Airbnb & Short-Term Rentals", type: "List Template", price: 599 },
      { id: 16, name: "Moving Timeline Planner", description: "Timeline planner template to help homeowners organize and schedule all tasks involved in the moving process.", category: "Home Buying", type: "Planner", price: 999 },
      { id: 17, name: "Neighborhood Comparison Sheet", description: "Comparison sheet template for evaluating different neighborhoods based on amenities, schools, safety, and other factors.", category: "Home Buying", type: "Worksheet", price: 799 },
      { id: 18, name: "New Homeowner Checklist", description: "Comprehensive checklist template for new homeowners covering essential tasks after purchasing a property.", category: "Home Buying", type: "Checklist", price: 899 },
      { id: 19, name: "Property Inspection Checklist", description: "Detailed inspection checklist template for evaluating property condition during buying or rental processes.", category: "Property Management", type: "Checklist", price: 899 },
      { id: 20, name: "Property Listing Flyers (For Sale)", description: "Professional flyer templates for marketing properties for sale with property details and photos.", category: "Realtor Marketing", type: "Flyer Template", price: 999 },
      { id: 21, name: "Property Maintenance Log", description: "Maintenance tracking log template for property managers to record repairs, services, and upkeep activities.", category: "Property Management", type: "Log Template", price: 799 },
      { id: 22, name: "Realtor Business Card", description: "Professional business card template designed for real estate agents to share contact information.", category: "Realtor Marketing", type: "Business Card Template", price: 499 },
      { id: 23, name: "Realtor Thank You Card", description: "Thank you card template for realtors to express appreciation to clients after transactions.", category: "Realtor Tools", type: "Card Template", price: 599 },
      { id: 24, name: "Realtor Welcome Guide Booklet", description: "Welcome guide booklet template for realtors to provide new clients with information about their services and the buying/selling process.", category: "Realtor Tools", type: "Guide Booklet", price: 1299 },
      { id: 25, name: "Rental Agreement Template", description: "Legal rental agreement template outlining terms, conditions, and responsibilities for landlords and tenants.", category: "Landlord Tools", type: "Contract Template", price: 1499 },
      { id: 26, name: "Rental Property Flyers", description: "Marketing flyer templates for advertising rental properties with property details and contact information.", category: "Landlord Tools", type: "Flyer Template", price: 899 },
      { id: 27, name: "Rental Property Tracker For Landlords", description: "Tracking spreadsheet template for landlords to manage multiple rental properties, tenants, and lease information.", category: "Landlord Tools", type: "Tracker", price: 1299 },
      { id: 28, name: "Review Request Cards", description: "Card template for hosts to request guest reviews after their stay at rental properties.", category: "Airbnb & Short-Term Rentals", type: "Card Template", price: 599 },
      { id: 29, name: "Security Guide", description: "Security guide template providing guests with safety information, emergency contacts, and security procedures for the property.", category: "Airbnb & Short-Term Rentals", type: "Guide Template", price: 799 },
      { id: 30, name: "Tenant Screening Forms", description: "Application and screening form templates for landlords to evaluate potential tenants.", category: "Landlord Tools", type: "Form Template", price: 999 },
      { id: 31, name: "Utility Setup Checklist", description: "Checklist template for new homeowners or tenants to set up utilities and essential services.", category: "Home Buying", type: "Checklist", price: 599 },
      { id: 32, name: "WiFi Password Display", description: "Decorative display template for sharing WiFi network name and password with guests.", category: "Airbnb & Short-Term Rentals", type: "Signage", price: 399 },
      { id: 33, name: "Landlord Expense Tracker", description: "Expense tracking spreadsheet template for landlords to monitor property-related costs and expenditures.", category: "Landlord Tools", type: "Tracker", price: 1099 },
      { id: 34, name: "Property Investment Calculator", description: "ROI calculator template for analyzing potential real estate investments and returns.", category: "Landlord Tools", type: "Calculator", price: 1499 },
      { id: 35, name: "Rent Collection Tracker", description: "Tracking spreadsheet template for landlords to monitor rent payments, due dates, and collection status.", category: "Landlord Tools", type: "Tracker", price: 999 },
      { id: 36, name: "Rental Income Tracker", description: "Income tracking spreadsheet template for landlords to record and analyze rental revenue.", category: "Landlord Tools", type: "Tracker", price: 999 },
      { id: 37, name: "Mortgage Payment Tracker", description: "Payment tracking spreadsheet template for homeowners to monitor mortgage payments, balances, and amortization.", category: "Home Buying", type: "Tracker", price: 899 },
    ];

    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

    for (const product of products) {
      const categoryId = categoryMap.get(product.category);
      if (!categoryId) continue;

      await ctx.db.insert("products", {
        name: product.name,
        slug: slugify(product.name),
        description: product.description,
        categoryId,
        type: product.type,
        price: product.price,
        isActive: true,
        createdAt: Date.now(),
      });
    }

    return { message: "Products seeded successfully" };
  },
});
