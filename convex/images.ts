import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./auth";

const MAX_FILENAME_LENGTH = 255;

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        await requireAdmin(ctx);
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveImage = mutation({
    args: {
        storageId: v.id("_storage"),
        filename: v.string(),
        uploaderId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const userId = await requireAdmin(ctx);

        // Validate filename
        if (args.filename.length > MAX_FILENAME_LENGTH) {
            throw new Error("Filename too long");
        }

        const url = await ctx.storage.getUrl(args.storageId);
        if (!url) throw new Error("Failed to get storage URL");

        const id = await ctx.db.insert("images", {
            storageId: args.storageId,
            url,
            filename: args.filename,
            uploaderId: userId,
            createdAt: Date.now(),
        });

        return { id, url };
    },
});

export const getImages = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const limit = Math.min(args.limit ?? 50, 100);
        return await ctx.db.query("images").order("desc").take(limit);
    },
});

export const deleteImage = mutation({
    args: { id: v.id("images") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        const image = await ctx.db.get(args.id);
        if (image) {
            await ctx.storage.delete(image.storageId);
            await ctx.db.delete(args.id);
        }
    },
});
