import { useParams, Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { calculateReadingTime, formatDate } from "../../lib/utils";
import TagBadge from "../../components/blog/TagBadge";
import Sidebar from "../../components/blog/Sidebar";

export default function PostPage() {
    const { slug } = useParams<{ slug: string }>();
    const post = useQuery(api.posts.getPostBySlug, { slug: slug || "" });

    if (post === undefined) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
                    <p className="text-foreground-muted font-display">Loading post...</p>
                </div>
            </div>
        );
    }

    if (post === null) {
        return (
            <div className="pt-24 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-display text-4xl font-bold text-foreground mb-4">
                        Post Not Found
                    </h1>
                    <p className="text-foreground-muted mb-6">
                        The post you're looking for doesn't exist.
                    </p>
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-primary font-display hover:gap-3 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const readingTime = calculateReadingTime(post.content);

    return (
        <>
            <Helmet>
                <title>{post.title} — Rochit Singh</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                {post.coverImage && (
                    <meta property="og:image" content={post.coverImage} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
            </Helmet>

            <div className="pt-24 sm:pt-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12">
                    {/* Back Link */}
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary font-display transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        Back to Blog
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <article className="lg:col-span-2">
                            {/* Cover Image */}
                            {post.coverImage && (
                                <div className="relative overflow-hidden mb-8 border border-border">
                                    <img
                                        src={post.coverImage}
                                        alt={post.title}
                                        className="w-full aspect-video object-cover"
                                    />
                                </div>
                            )}

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {post.tags.map((tag) => (
                                        <TagBadge key={tag} name={tag} clickable size="sm" />
                                    ))}
                                </div>
                            )}

                            {/* Title */}
                            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 pb-6 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 border border-primary/30 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-sm text-foreground-secondary font-display">
                                        {post.author.username}
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(post.createdAt)}
                                </div>

                                <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
                                    <Clock className="w-4 h-4" />
                                    {readingTime} min read
                                </div>
                            </div>

                            {/* Content */}
                            <div
                                className="prose-blog"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                            />
                        </article>

                        {/* Sidebar */}
                        <div className="hidden lg:block">
                            <div className="sticky top-28">
                                <Sidebar />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
