import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

// Admin only: get all allowed emails
export const getAllowedEmails = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.db.query("allowedEmails").order("desc").collect();
    },
});

// Admin only: add an allowed email
export const addAllowedEmail = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const userId = await requireAdmin(ctx);

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

// Admin only: remove an allowed email
export const removeAllowedEmail = mutation({
    args: { id: v.id("allowedEmails") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});

// Admin only: check if an email is allowed
export const isEmailAllowed = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
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
