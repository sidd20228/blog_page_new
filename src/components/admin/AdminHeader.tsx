import { useLocation } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const titles: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/dashboard": "Dashboard",
    "/admin/posts": "Posts",
    "/admin/editor": "New Post",
    "/admin/media": "Media Library",
    "/admin/settings": "Settings",
};

export default function AdminHeader() {
    const location = useLocation();
    const user = useQuery(api.users.getCurrentUser);

    // Check if editing existing post
    const isEditing = location.pathname.match(/^\/admin\/editor\/.+/);
    const title = isEditing
        ? "Edit Post"
        : titles[location.pathname] || "Admin";

    return (
        <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
            <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs text-foreground-subtle font-mono">
                    {new Date().toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                    })}
                </span>
                {user && (
                    <div className="flex items-center gap-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="w-6 h-6 border border-primary/30 object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 border border-primary/30 flex items-center justify-center">
                                <span className="text-[10px] text-primary font-mono">
                                    {(user.name || user.email || "?")[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
