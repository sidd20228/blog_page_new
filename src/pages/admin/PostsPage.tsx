import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Plus } from "lucide-react";
import { formatDateShort } from "../../lib/utils";
import { toast } from "sonner";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";

export default function PostsPage() {
    const posts = useQuery(api.posts.getAllPosts);
    const deletePost = useMutation(api.posts.deletePost);
    const [filter, setFilter] = useState<string>("all");

    const handleDelete = async (id: Id<"posts">, title: string) => {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        try {
            await deletePost({ id });
            toast.success("Post deleted");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    const filteredPosts = posts?.filter((p) =>
        filter === "all" ? true : p.status === filter
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="font-display text-xl font-bold text-foreground">
                        All Posts
                    </h2>
                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1">
                        {["all", "published", "draft", "scheduled"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all ${filter === f
                                    ? "bg-primary/20 text-primary border border-primary/30"
                                    : "text-foreground-muted hover:text-foreground"
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <Link
                    to="/admin/editor"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-display text-sm font-medium hover:shadow-glow-cyan transition-all"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Posts Table */}
            <div className="border border-border bg-card overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border bg-background-secondary">
                            <th className="text-left px-4 py-3 text-xs font-display font-semibold text-foreground-muted uppercase tracking-wider">
                                Title
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-display font-semibold text-foreground-muted uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-display font-semibold text-foreground-muted uppercase tracking-wider hidden sm:table-cell">
                                Author
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-display font-semibold text-foreground-muted uppercase tracking-wider hidden md:table-cell">
                                Date
                            </th>
                            <th className="text-right px-4 py-3 text-xs font-display font-semibold text-foreground-muted uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                        {filteredPosts?.map((post) => (
                            <tr
                                key={post._id}
                                className="hover:bg-background-secondary transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <Link
                                        to={`/admin/editor/${post._id}`}
                                        className="text-sm text-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        {post.title || "Untitled"}
                                    </Link>
                                    {post.tags.length > 0 && (
                                        <div className="flex gap-1 mt-1">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[10px] text-primary/70 font-mono"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`text-[10px] px-2 py-0.5 font-mono uppercase tracking-wider ${post.status === "published"
                                            ? "bg-accent/20 text-accent border border-accent/30"
                                            : post.status === "scheduled"
                                                ? "bg-gold/20 text-gold border border-gold/30"
                                                : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        {post.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-foreground-muted hidden sm:table-cell">
                                    {post.author.username}
                                </td>
                                <td className="px-4 py-3 text-xs text-foreground-subtle font-mono hidden md:table-cell">
                                    {formatDateShort(post.updatedAt)}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link
                                            to={`/admin/editor/${post._id}`}
                                            className="p-2 text-foreground-subtle hover:text-primary transition-colors"
                                            title="Edit"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post._id, post.title)}
                                            className="p-2 text-foreground-subtle hover:text-destructive transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!filteredPosts || filteredPosts.length === 0) && (
                    <div className="py-12 text-center text-foreground-subtle text-sm">
                        No posts found
                    </div>
                )}
            </div>
        </div>
    );
}
