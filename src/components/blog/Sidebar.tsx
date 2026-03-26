import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Search, Tag, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDateShort } from "../../lib/utils";
import TagBadge from "./TagBadge";

export default function Sidebar() {
    const [searchQuery, setSearchQuery] = useState("");
    const tags = useQuery(api.tags.getAllTags);
    const recentPosts = useQuery(api.posts.getRecentPosts, { limit: 5 });
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <aside className="space-y-8">
            {/* Search */}
            <div className="border border-border bg-card p-5">
                <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-widest mb-4 pb-3 border-b border-primary flex items-center gap-2">
                    <Search className="w-3.5 h-3.5 text-primary" />
                    Search
                </h3>
                <form onSubmit={handleSearch} className="flex">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search posts..."
                        className="flex-1 bg-background border border-border px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                    />
                    <button
                        type="submit"
                        className="px-3 py-2 bg-primary text-primary-foreground transition-all"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </form>
            </div>

            {/* Tags */}
            <div className="border border-border bg-card p-5">
                <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-widest mb-4 pb-3 border-b border-primary flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                        <TagBadge key={tag._id} name={tag.name} slug={tag.slug} clickable size="sm" />
                    ))}
                    {(!tags || tags.length === 0) && (
                        <p className="text-xs text-foreground-subtle">No tags yet</p>
                    )}
                </div>
            </div>

            {/* Recent Posts */}
            <div className="border border-border bg-card p-5">
                <h3 className="font-display text-xs font-semibold text-foreground uppercase tracking-widest mb-4 pb-3 border-b border-primary flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5 text-primary" />
                    Recent Posts
                </h3>
                <div className="space-y-4">
                    {recentPosts?.map((post) => (
                        <Link
                            key={post._id}
                            to={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2 mb-1">
                                {post.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-foreground-subtle">
                                <Clock className="w-3 h-3" />
                                {formatDateShort(post.createdAt)}
                            </div>
                        </Link>
                    ))}
                    {(!recentPosts || recentPosts.length === 0) && (
                        <p className="text-xs text-foreground-subtle">No posts yet</p>
                    )}
                </div>
            </div>
        </aside>
    );
}
