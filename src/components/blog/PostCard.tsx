import { Link } from "react-router-dom";
import { Clock, User, ArrowRight } from "lucide-react";
import { cn, calculateReadingTime, formatDate } from "../../lib/utils";
import TagBadge from "./TagBadge";

interface PostCardProps {
    title: string;
    slug: string;
    excerpt: string;
    coverImage?: string;
    tags: string[];
    createdAt: number;
    author: {
        username: string;
        image?: string;
    };
    content: string;
    featured?: boolean;
}

export default function PostCard({
    title,
    slug,
    excerpt,
    coverImage,
    tags,
    createdAt,
    author,
    content,
    featured = false,
}: PostCardProps) {
    const readingTime = calculateReadingTime(content);

    return (
        <Link
            to={`/blog/${slug}`}
            className={cn(
                "group block bg-card border border-card-border hover:border-primary/50 transition-all duration-500",
                "hover:shadow-card-hover hover:-translate-y-1",
                featured && "lg:col-span-2"
            )}
        >
            {/* Cover Image */}
            {coverImage && (
                <div className="relative overflow-hidden aspect-video">
                    <img
                        src={coverImage}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                </div>
            )}

            <div className="p-6">
                {/* Tags */}
                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.slice(0, 3).map((tag) => (
                            <TagBadge key={tag} name={tag} size="sm" />
                        ))}
                    </div>
                )}

                {/* Title */}
                <h3
                    className={cn(
                        "font-display font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2",
                        featured ? "text-2xl" : "text-lg"
                    )}
                >
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-foreground-muted leading-relaxed mb-4 line-clamp-2">
                    {excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between pt-4 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-primary/30 flex items-center justify-center">
                            <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-xs text-foreground-muted font-display">
                            {author.username}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-foreground-subtle">
                        <span>{formatDate(createdAt)}</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{readingTime} min</span>
                        </div>
                    </div>
                </div>

                {/* Read More Arrow */}
                <div className="flex items-center gap-2 mt-4 text-primary text-sm font-display opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Read More
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    );
}
