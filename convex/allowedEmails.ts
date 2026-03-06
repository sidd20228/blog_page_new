import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get all allowed emails
export const getAllowedEmails = query({
    handler: async (ctx) => {
        return await ctx.db.query("allowedEmails").order("desc").collect();
    },
});

// Add an allowed email (admin only)
export const addAllowedEmail = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if already exists
        const existing = await ctx.db
            .query("allowedEmails")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .first();
        if (existing) throw new Error("Email already in the allowed list");

        return await ctx.db.insert("allowedEmails", {
            email: args.email.toLowerCase(),
            addedBy: userId,
            createdAt: Date.now(),
        });
    },
});

// Remove an allowed email (admin only)
export const removeAllowedEmail = mutation({
    args: { id: v.id("allowedEmails") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");
        await ctx.db.delete(args.id);
    },
});

// Check if an email is allowed for OAuth
export const isEmailAllowed = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        // If no allowed emails exist, allow all
        const allAllowed = await ctx.db.query("allowedEmails").collect();
        if (allAllowed.length === 0) return true;

        const found = await ctx.db
            .query("allowedEmails")
            .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
            .first();
        return !!found;
    },
});
