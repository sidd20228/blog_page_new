import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
    handler: async (ctx) => {
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
        const url = await ctx.storage.getUrl(args.storageId);
        if (!url) throw new Error("Failed to get storage URL");

        const id = await ctx.db.insert("images", {
            storageId: args.storageId,
            url,
            filename: args.filename,
            uploaderId: args.uploaderId,
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
        const limit = args.limit ?? 50;
        return await ctx.db.query("images").order("desc").take(limit);
    },
});

export const deleteImage = mutation({
    args: { id: v.id("images") },
    handler: async (ctx, args) => {
        const image = await ctx.db.get(args.id);
        if (image) {
            await ctx.storage.delete(image.storageId);
            await ctx.db.delete(args.id);
        }
    },
});
