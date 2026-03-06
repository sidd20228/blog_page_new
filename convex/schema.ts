import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
    ...authTables,

    users: defineTable({
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        image: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        // Custom fields
        role: v.optional(v.string()), // "admin" | "editor"
        createdAt: v.optional(v.number()),
    }).index("email", ["email"]),

    posts: defineTable({
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.string(),
        authorId: v.id("users"),
        status: v.string(), // "draft" | "published" | "scheduled"
        tags: v.array(v.string()),
        coverImage: v.optional(v.string()),
        createdAt: v.number(),
        updatedAt: v.number(),
        publishDate: v.optional(v.number()),
    })
        .index("by_slug", ["slug"])
        .index("by_status", ["status"])
        .index("by_author", ["authorId"])
        .index("by_status_publishDate", ["status", "publishDate"]),

    tags: defineTable({
        name: v.string(),
        slug: v.string(),
    }).index("by_slug", ["slug"]),

    images: defineTable({
        storageId: v.id("_storage"),
        url: v.string(),
        filename: v.string(),
        uploaderId: v.optional(v.id("users")),
        createdAt: v.number(),
    }),

    settings: defineTable({
        blogTitle: v.string(),
        blogDescription: v.string(),
        postsPerPage: v.number(),
    }),

    allowedEmails: defineTable({
        email: v.string(),
        addedBy: v.optional(v.id("users")),
        createdAt: v.number(),
    }).index("by_email", ["email"]),
});
