import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import PostCard from "../../components/blog/PostCard";
import Sidebar from "../../components/blog/Sidebar";

export default function BlogListPage() {
    const result = useQuery(api.posts.getPublishedPosts, { limit: 20 });

    return (
        <>
            <Helmet>
                <title>Blog — Rochit Singh</title>
                <meta name="description" content="Browse all published blog posts." />
            </Helmet>

            <div className="pt-24 sm:pt-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
                            All <span className="gradient-text-cyber">Posts</span>
                        </h1>
                        <p className="text-foreground-muted">
                            Browse our collection of articles and tutorials
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Posts Grid */}
                        <div className="lg:col-span-2">
                            {result?.posts && result.posts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {result.posts.map((post) => (
                                        <PostCard key={post._id} {...post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 border border-border bg-card">
                                    <p className="text-foreground-muted font-display text-lg">
                                        No posts published yet
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="hidden lg:block">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
