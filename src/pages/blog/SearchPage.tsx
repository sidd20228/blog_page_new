import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import { Search as SearchIcon } from "lucide-react";
import PostCard from "../../components/blog/PostCard";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const [debouncedQuery, setDebouncedQuery] = useState(query);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            if (query) {
                setSearchParams({ q: query });
            } else {
                setSearchParams({});
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query, setSearchParams]);

    const results = useQuery(
        api.posts.searchPosts,
        debouncedQuery ? { query: debouncedQuery } : "skip"
    );

    return (
        <>
            <Helmet>
                <title>Search — Rochit Singh</title>
                <meta name="description" content="Search blog posts" />
            </Helmet>

            <div className="pt-24 sm:pt-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
                    <div className="max-w-3xl mx-auto mb-12">
                        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-8 text-center">
                            <span className="gradient-text-cyber">Search</span> Posts
                        </h1>

                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-subtle" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search by title, content, or tags..."
                                className="w-full bg-card border border-border px-12 py-4 text-lg text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors font-display"
                                autoFocus
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {debouncedQuery && results !== undefined && (
                            <p className="text-sm text-foreground-muted mt-4">
                                {results.length} result{results.length !== 1 ? "s" : ""} for "
                                <span className="text-primary">{debouncedQuery}</span>"
                            </p>
                        )}
                    </div>

                    {results && results.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {results.map((post) => (
                                <PostCard key={post._id} {...post} />
                            ))}
                        </div>
                    ) : debouncedQuery && results ? (
                        <div className="text-center py-16">
                            <p className="text-foreground-muted font-display text-lg mb-2">
                                No results found
                            </p>
                            <p className="text-sm text-foreground-subtle">
                                Try different keywords or browse tags
                            </p>
                        </div>
                    ) : !debouncedQuery ? (
                        <div className="text-center py-16">
                            <p className="text-foreground-subtle font-display">
                                Start typing to search...
                            </p>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    );
}
