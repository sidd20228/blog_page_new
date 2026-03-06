import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get settings for the blog
export const getSettings = query({
    handler: async (ctx) => {
        const settings = await ctx.db.query("settings").first();
        return settings || {
            blogTitle: "BlogCMS",
            blogDescription: "A modern serverless blog platform",
            postsPerPage: 10,
        };
    },
});

// Update settings (admin only)
export const updateSettings = mutation({
    args: {
        blogTitle: v.optional(v.string()),
        blogDescription: v.optional(v.string()),
        postsPerPage: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db.query("settings").first();
        const updates: Record<string, unknown> = {};
        if (args.blogTitle !== undefined) updates.blogTitle = args.blogTitle;
        if (args.blogDescription !== undefined) updates.blogDescription = args.blogDescription;
        if (args.postsPerPage !== undefined) updates.postsPerPage = args.postsPerPage;

        if (existing) {
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        } else {
            return await ctx.db.insert("settings", {
                blogTitle: args.blogTitle || "BlogCMS",
                blogDescription: args.blogDescription || "A modern serverless blog platform",
                postsPerPage: args.postsPerPage || 10,
            });
        }
    },
});

// Update user profile (name)
export const updateUserProfile = mutation({
    args: {
        name: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const updates: Record<string, unknown> = {};
        if (args.name !== undefined) updates.name = args.name;

        await ctx.db.patch(userId, updates);
        return userId;
    },
});
