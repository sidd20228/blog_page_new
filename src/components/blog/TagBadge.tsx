import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

interface TagBadgeProps {
    name: string;
    slug?: string;
    size?: "sm" | "md" | "lg";
    clickable?: boolean;
    count?: number;
}

export default function TagBadge({
    name,
    slug,
    size = "md",
    clickable = false,
    count,
}: TagBadgeProps) {
    const tagSlug = slug || name.toLowerCase().replace(/\s+/g, "-");

    const classes = cn(
        "inline-flex items-center gap-1.5 border border-primary/30 text-primary font-mono uppercase tracking-wider transition-all duration-300",
        "hover:border-primary hover:bg-primary/10 hover:shadow-glow-cyan",
        {
            "text-[10px] px-2 py-0.5": size === "sm",
            "text-xs px-3 py-1": size === "md",
            "text-sm px-4 py-1.5": size === "lg",
        }
    );

    if (clickable) {
        return (
            <Link to={`/tags/${tagSlug}`} className={classes}>
                <span>#</span>
                <span>{name}</span>
                {count !== undefined && (
                    <span className="text-foreground-subtle ml-1">({count})</span>
                )}
            </Link>
        );
    }

    return (
        <span className={classes} onClick={(e) => e.preventDefault()}>
            <span>#</span>
            <span>{name}</span>
            {count !== undefined && (
                <span className="text-foreground-subtle ml-1">({count})</span>
            )}
        </span>
    );
}
