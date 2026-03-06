import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { FileText, FileCheck, Clock, PenTool, ArrowRight } from "lucide-react";
import { formatDateShort, timeAgo } from "../../lib/utils";

export default function DashboardPage() {
    const stats = useQuery(api.posts.getPostStats);
    const recentPosts = useQuery(api.posts.getRecentPosts, { limit: 8 });

    const statCards = [
        {
            label: "Total Posts",
            value: stats?.total ?? 0,
            icon: FileText,
            color: "text-primary",
            border: "border-primary/30",
            glow: "hover:shadow-glow-cyan",
        },
        {
            label: "Published",
            value: stats?.published ?? 0,
            icon: FileCheck,
            color: "text-accent",
            border: "border-accent/30",
            glow: "hover:shadow-glow-green",
        },
        {
            label: "Drafts",
            value: stats?.drafts ?? 0,
            icon: PenTool,
            color: "text-foreground-muted",
            border: "border-border",
            glow: "",
        },
        {
            label: "Scheduled",
            value: stats?.scheduled ?? 0,
            icon: Clock,
            color: "text-gold",
            border: "border-gold/30",
            glow: "hover:shadow-glow-gold",
        },
    ];

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`bg-card border ${stat.border} p-6 transition-all duration-300 ${stat.glow}`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-xs text-foreground-subtle font-mono uppercase">
                                {stat.label}
                            </span>
                        </div>
                        <div className={`font-mono text-3xl font-bold ${stat.color}`}>
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                    to="/admin/editor"
                    className="flex items-center gap-4 p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 border border-primary flex items-center justify-center group-hover:shadow-glow-cyan transition-shadow">
                        <PenTool className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm font-semibold text-foreground">
                            Create New Post
                        </h3>
                        <p className="text-xs text-foreground-muted mt-0.5">
                            Write and publish new content
                        </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                    to="/admin/posts"
                    className="flex items-center gap-4 p-6 bg-card border border-border hover:border-primary/50 transition-all duration-300 group"
                >
                    <div className="w-12 h-12 border border-accent flex items-center justify-center group-hover:shadow-glow-green transition-shadow">
                        <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <h3 className="font-display text-sm font-semibold text-foreground">
                            Manage Posts
                        </h3>
                        <p className="text-xs text-foreground-muted mt-0.5">
                            Edit, delete, or schedule posts
                        </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-card border border-border">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-display text-sm font-semibold text-foreground uppercase tracking-widest">
                        Recent Activity
                    </h2>
                    <Link
                        to="/admin/posts"
                        className="text-xs text-primary font-display hover:underline"
                    >
                        View All
                    </Link>
                </div>
                <div className="divide-y divide-border-subtle">
                    {recentPosts?.map((post) => (
                        <Link
                            key={post._id}
                            to={`/admin/editor/${post._id}`}
                            className="flex items-center justify-between px-6 py-3 hover:bg-background-secondary transition-colors"
                        >
                            <div className="flex items-center gap-4 min-w-0">
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
                                <span className="text-sm text-foreground truncate">
                                    {post.title}
                                </span>
                            </div>
                            <span className="text-xs text-foreground-subtle whitespace-nowrap ml-4">
                                {timeAgo(post.updatedAt)}
                            </span>
                        </Link>
                    ))}
                    {(!recentPosts || recentPosts.length === 0) && (
                        <div className="px-6 py-8 text-center text-sm text-foreground-subtle">
                            No activity yet. Create your first post!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
