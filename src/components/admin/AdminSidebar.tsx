import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../../../convex/_generated/api";
import {
    LayoutDashboard,
    FileText,
    PenTool,
    TrendingUp,
    Image,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Posts", href: "/admin/posts", icon: FileText },
    { label: "New Post", href: "/admin/editor", icon: PenTool },
    { label: "Media", href: "/admin/media", icon: Image },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const { signOut } = useAuthActions();
    const user = useQuery(api.users.getCurrentUser);

    return (
        <aside
            className={cn(
                "h-screen sticky top-0 bg-background border-r border-border flex flex-col transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center px-4 border-b border-border">
                <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 border border-primary flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    {!collapsed && (
                        <span className="font-display text-lg font-bold text-foreground tracking-tight whitespace-nowrap">
                            ROCHIT<span className="text-primary">SINGH</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === "/admin/dashboard"}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-3 py-2.5 text-sm font-display transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                                    : "text-foreground-muted hover:text-foreground hover:bg-background-secondary"
                            )
                        }
                    >
                        <item.icon className="w-4 h-4 shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* User & Controls */}
            <div className="border-t border-border p-3 space-y-2">
                {/* View Blog */}
                <Link
                    to="/blog"
                    className="flex items-center gap-3 px-3 py-2 text-xs font-display text-foreground-subtle hover:text-primary transition-colors"
                >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    {!collapsed && <span>View Blog</span>}
                </Link>

                {/* User Info */}
                {user && !collapsed && (
                    <div className="flex items-center gap-3 px-3 py-2">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name || "User"}
                                className="w-7 h-7 border border-primary/30 shrink-0 object-cover"
                            />
                        ) : (
                            <div className="w-7 h-7 border border-primary/30 flex items-center justify-center shrink-0">
                                <span className="text-xs text-primary font-mono">
                                    {(user.name || user.email || "?")[0]?.toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="text-xs font-display text-foreground truncate">
                                {user.name || user.email || "User"}
                            </p>
                            <p className="text-[10px] text-foreground-subtle truncate">
                                {user.role || "admin"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Logout */}
                <button
                    onClick={() => void signOut()}
                    className="flex items-center gap-3 px-3 py-2 w-full text-xs font-display text-foreground-subtle hover:text-destructive transition-colors"
                >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    {!collapsed && <span>Logout</span>}
                </button>

                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-1.5 text-foreground-subtle hover:text-primary transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>
        </aside>
    );
}
