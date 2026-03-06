import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get the currently authenticated user from Convex Auth session
export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        if (!user) return null;
        return {
            ...user,
            role: user.role || "admin",
        };
    },
});

export const getUserById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getAllUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

// Set role for a user (admin utility)
export const setUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.userId, { role: args.role });
    },
});
