import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import PostCard from "../../components/blog/PostCard";
import Sidebar from "../../components/blog/Sidebar";

export default function HomePage() {
    const result = useQuery(api.posts.getPublishedPosts, { limit: 6 });

    return (
        <>
            <Helmet>
                <title>Rochit Singh — Trading Insights</title>
                <meta
                    name="description"
                    content="Trading insights, market analysis, and educational content from Rochit Singh. Sharp precision, cutting-edge strategies."
                />
            </Helmet>

            {/* Hero Section */}
            <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden grid-pattern">
                <div className="absolute inset-0 bg-gradient-radial-cyan opacity-30" />
                <div className="absolute inset-0 scan-lines pointer-events-none" />

                <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/50 mb-6 opacity-0 animate-fade-in-up">
                            <span className="w-2 h-2 bg-primary animate-pulse" />
                            <span className="font-display text-xs font-medium text-primary uppercase tracking-widest">
                                Trading Insights & Analysis
                            </span>
                        </div>

                        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 opacity-0 animate-fade-in-up delay-100">
                            <span className="text-foreground">Trading</span>
                            <br />
                            <span className="gradient-text-matrix text-glow-cyan">
                                Insights
                            </span>
                        </h1>

                        <p className="text-sm sm:text-lg text-foreground-muted max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up delay-200">
                            Explore market analysis, actionable trading strategies, and in-depth educational content designed to elevate your trading journey.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up delay-300">
                            <Link
                                to="/blog"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground font-display text-sm font-medium transition-all duration-300 group"
                            >
                                Read Latest Posts
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <a
                                href="https://rochitsingh.com/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary font-display text-sm font-medium hover:bg-primary/10 transition-all duration-300"
                            >
                                Explore Courses
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center mt-16 pt-8 border-t border-border opacity-0 animate-fade-in-up delay-500">
                            <div className="flex items-center gap-8 sm:gap-16">
                                {[
                                    { value: "100+", label: "In-Depth Articles" },
                                    { value: "50k+", label: "Active Traders" },
                                    { value: "1M+", label: "Views Monthly" },
                                ].map((stat, i) => (
                                    <div key={stat.label} className={`text-center ${i !== 2 ? 'pr-8 sm:pr-16 border-r border-border' : ''}`}>
                                        <div className="font-mono text-2xl sm:text-3xl font-bold text-primary text-glow-cyan">
                                            {stat.value}
                                        </div>
                                        <div className="font-display text-xs text-foreground-muted uppercase tracking-widest mt-2 whitespace-pre-wrap">
                                            {stat.label.replace(' ', '\n')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in-up delay-700">
                    <span className="font-display text-xs text-foreground-subtle uppercase tracking-widest">
                        Latest Posts
                    </span>
                    <ChevronDown className="w-5 h-5 text-primary animate-bounce" />
                </div>
            </section>

            {/* Latest Posts */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-24">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                            Latest <span className="gradient-text-cyber">Posts</span>
                        </h2>
                        <p className="text-sm text-foreground-muted mt-2">
                            Fresh content from our blog
                        </p>
                    </div>
                    <Link
                        to="/blog"
                        className="hidden sm:inline-flex items-center gap-2 text-sm text-primary font-display hover:gap-3 transition-all duration-300"
                    >
                        View All
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {result?.posts && result.posts.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {result.posts.map((post, index) => (
                                    <PostCard
                                        key={post._id}
                                        {...post}
                                        featured={index === 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-border bg-card">
                                <p className="text-foreground-muted font-display text-lg mb-2">
                                    No posts yet
                                </p>
                                <p className="text-sm text-foreground-subtle mb-6">
                                    Create your first post from the admin dashboard
                                </p>
                                <Link
                                    to="/admin/editor"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-display text-sm transition-all"
                                >
                                    Create First Post
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block">
                        <Sidebar />
                    </div>
                </div>
            </section>
        </>
    );
}
