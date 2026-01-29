import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        excerpt: v.string(),
        content: v.string(),
        mainImageId: v.optional(v.id("_storage")),
        mainImageUrl: v.optional(v.string()),
        isPublished: v.boolean(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert("posts", {
            ...args,
            createdAt: now,
            updatedAt: now,
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("posts"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        content: v.optional(v.string()),
        mainImageId: v.optional(v.id("_storage")),
        mainImageUrl: v.optional(v.string()),
        isPublished: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        const now = Date.now();
        await ctx.db.patch(id, {
            ...updates,
            updatedAt: now,
        });
    },
});

export const remove = mutation({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const listAll = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("posts")
            .order("desc")
            .collect();
    },
});

export const listPublished = query({
    args: { paginationOpts: paginationOptsValidator },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("posts")
            .withIndex("by_published", (q) => q.eq("isPublished", true))
            .order("desc")
            .paginate(args.paginationOpts);
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("posts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});

export const getById = query({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});
