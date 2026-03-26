import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

// Public: tags are visible to all visitors
export const getAllTags = query({
    handler: async (ctx) => {
        return await ctx.db.query("tags").collect();
    },
});

export const getTagBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tags")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
    },
});

// Admin only: creating and deleting tags
export const createTag = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);

        // Check if tag already exists
        const existing = await ctx.db
            .query("tags")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existing) {
            return existing._id;
        }

        return await ctx.db.insert("tags", {
            name: args.name,
            slug: args.slug,
        });
    },
});

export const deleteTag = mutation({
    args: { id: v.id("tags") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});
