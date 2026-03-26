import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import { ArrowLeft } from "lucide-react";
import PostCard from "../../components/blog/PostCard";

export default function TagPostsPage() {
    const { slug } = useParams<{ slug: string }>();
    const posts = useQuery(api.posts.getPostsByTag, { tag: slug || "" });

    return (
        <>
            <Helmet>
                <title>#{slug} — Rochit Singh</title>
                <meta name="description" content={`Posts tagged with #${slug}`} />
            </Helmet>

            <div className="pt-24 sm:pt-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
                    <Link
                        to="/tags"
                        className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary font-display transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        All Tags
                    </Link>

                    <div className="mb-12">
                        <h1 className="font-display text-4xl sm:text-5xl font-bold text-foreground mb-2">
                            <span className="text-primary">#</span>{slug}
                        </h1>
                        <p className="text-foreground-muted">
                            {posts?.length || 0} posts with this tag
                        </p>
                    </div>

                    {posts && posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post) => (
                                <PostCard key={post._id} {...post} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-border bg-card">
                            <p className="text-foreground-muted font-display text-lg">
                                No posts found with this tag
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
