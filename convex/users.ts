import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth, requireAdmin } from "./auth";

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

// Admin only: get any user by ID
export const getUserById = query({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        return await ctx.db.get(args.id);
    },
});

// Admin only: list all users
export const getAllUsers = query({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.db.query("users").collect();
    },
});

// Admin only: set role for a user
export const setUserRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.union(v.literal("admin"), v.literal("editor")),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.patch(args.userId, { role: args.role });
    },
});
