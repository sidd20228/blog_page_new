import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ── Queries ──────────────────────────────────────────────────────────────

export const getPublishedPosts = query({
    args: {
        limit: v.optional(v.number()),
        cursor: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 10;
        let posts = await ctx.db
            .query("posts")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .order("desc")
            .collect();

        // Manual cursor-based pagination using createdAt
        if (args.cursor) {
            posts = posts.filter((p) => p.createdAt < args.cursor!);
        }

        const paginatedPosts = posts.slice(0, limit);

        // Fetch author info for each post
        const postsWithAuthors = await Promise.all(
            paginatedPosts.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return {
                    ...post,
                    author: author
                        ? { username: author.name || "Unknown", image: author.image }
                        : { username: "Unknown", image: undefined },
                };
            })
        );

        return {
            posts: postsWithAuthors,
            nextCursor:
                paginatedPosts.length === limit
                    ? paginatedPosts[paginatedPosts.length - 1].createdAt
                    : null,
        };
    },
});

export const getPostBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        const post = await ctx.db
            .query("posts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!post) return null;

        const author = await ctx.db.get(post.authorId);
        return {
            ...post,
            author: author
                ? { username: author.name || "Unknown", image: author.image }
                : { username: "Unknown", image: undefined },
        };
    },
});

export const getPostsByTag = query({
    args: { tag: v.string() },
    handler: async (ctx, args) => {
        const allPosts = await ctx.db
            .query("posts")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .order("desc")
            .collect();

        const filtered = allPosts.filter((post) =>
            post.tags.some((t) => t.toLowerCase() === args.tag.toLowerCase())
        );

        const postsWithAuthors = await Promise.all(
            filtered.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return {
                    ...post,
                    author: author
                        ? { username: author.name || "Unknown", image: author.image }
                        : { username: "Unknown", image: undefined },
                };
            })
        );

        return postsWithAuthors;
    },
});

export const searchPosts = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        const searchTerm = args.query.toLowerCase();
        if (!searchTerm) return [];

        const allPosts = await ctx.db
            .query("posts")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .collect();

        const results = allPosts.filter(
            (post) =>
                post.title.toLowerCase().includes(searchTerm) ||
                post.content.toLowerCase().includes(searchTerm) ||
                post.tags.some((t) => t.toLowerCase().includes(searchTerm))
        );

        const postsWithAuthors = await Promise.all(
            results.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return {
                    ...post,
                    author: author
                        ? { username: author.name || "Unknown", image: author.image }
                        : { username: "Unknown", image: undefined },
                };
            })
        );

        return postsWithAuthors;
    },
});

// Admin queries
export const getAllPosts = query({
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").collect();

        const postsWithAuthors = await Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return {
                    ...post,
                    author: author
                        ? { username: author.name || "Unknown", image: author.image }
                        : { username: "Unknown", image: undefined },
                };
            })
        );

        return postsWithAuthors;
    },
});

export const getPostById = query({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        const post = await ctx.db.get(args.id);
        if (!post) return null;

        const author = await ctx.db.get(post.authorId);
        return {
            ...post,
            author: author
                ? { username: author.name || "Unknown", image: author.image }
                : { username: "Unknown", image: undefined },
        };
    },
});

export const getPostStats = query({
    handler: async (ctx) => {
        const all = await ctx.db.query("posts").collect();
        const published = all.filter((p) => p.status === "published");
        const drafts = all.filter((p) => p.status === "draft");
        const scheduled = all.filter((p) => p.status === "scheduled");

        return {
            total: all.length,
            published: published.length,
            drafts: drafts.length,
            scheduled: scheduled.length,
        };
    },
});

export const getRecentPosts = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 5;
        const posts = await ctx.db.query("posts").order("desc").take(limit);

        const postsWithAuthors = await Promise.all(
            posts.map(async (post) => {
                const author = await ctx.db.get(post.authorId);
                return {
                    ...post,
                    author: author
                        ? { username: author.name || "Unknown", image: author.image }
                        : { username: "Unknown", image: undefined },
                };
            })
        );

        return postsWithAuthors;
    },
});

// ── Mutations ────────────────────────────────────────────────────────────

export const createPost = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.string(),
        authorId: v.id("users"),
        status: v.string(),
        tags: v.array(v.string()),
        coverImage: v.optional(v.string()),
        publishDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        // Check slug uniqueness
        const existing = await ctx.db
            .query("posts")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();
        if (existing) {
            throw new Error(`A post with slug "${args.slug}" already exists.`);
        }

        const now = Date.now();
        const id = await ctx.db.insert("posts", {
            title: args.title,
            slug: args.slug,
            content: args.content,
            excerpt: args.excerpt,
            authorId: args.authorId,
            status: args.status,
            tags: args.tags,
            coverImage: args.coverImage,
            publishDate: args.publishDate,
            createdAt: now,
            updatedAt: now,
        });

        return id;
    },
});

export const updatePost = mutation({
    args: {
        id: v.id("posts"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        status: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        coverImage: v.optional(v.string()),
        publishDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // If slug is being changed, check uniqueness
        if (updates.slug) {
            const existing = await ctx.db
                .query("posts")
                .withIndex("by_slug", (q) => q.eq("slug", updates.slug!))
                .first();
            if (existing && existing._id !== id) {
                throw new Error(`A post with slug "${updates.slug}" already exists.`);
            }
        }

        // Filter out undefined values
        const cleanUpdates: Record<string, unknown> = { updatedAt: Date.now() };
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        }

        await ctx.db.patch(id, cleanUpdates);
        return id;
    },
});

export const deletePost = mutation({
    args: { id: v.id("posts") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Publish scheduled posts (called by cron)
export const publishScheduledPosts = mutation({
    handler: async (ctx) => {
        const now = Date.now();
        const scheduled = await ctx.db
            .query("posts")
            .withIndex("by_status", (q) => q.eq("status", "scheduled"))
            .collect();

        let count = 0;
        for (const post of scheduled) {
            if (post.publishDate && post.publishDate <= now) {
                await ctx.db.patch(post._id, {
                    status: "published",
                    updatedAt: now,
                });
                count++;
            }
        }

        return { published: count };
    },
});
