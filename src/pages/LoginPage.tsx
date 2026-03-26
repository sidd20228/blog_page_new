import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Loader2, User, Lock, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuthActions();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const [signingIn, setSigningIn] = useState<string | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

    // Redirect to admin when authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);



    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username.trim() || !password.trim()) return;

        setSigningIn("password");
        try {
            const formData = new FormData();
            formData.set("email", username.trim());
            formData.set("password", password);
            formData.set("flow", "signIn");

            await signIn("password", formData);
        } catch (err: any) {
            console.error("Password sign-in failed:", err);
            toast.error("Invalid username or password.");
            setSigningIn(null);
        }
    };

    // Loading states
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-radial-cyan opacity-20" />
                <div className="relative text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm text-foreground-muted font-display">Completing sign-in...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-radial-cyan opacity-20" />
                <div className="relative text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-sm text-foreground-muted font-display">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-radial-cyan opacity-20" />
            <div className="absolute inset-0 scan-lines pointer-events-none" />

            <div className="relative w-full max-w-md">
                <div className="bg-card border border-border p-8 sm:p-10 space-y-6">
                    {/* Logo */}
                    <div className="text-center">
                        <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mx-auto mb-5 transition-shadow duration-500">
                            <TrendingUp className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                            ROCHIT<span className="text-primary">SINGH</span>
                        </h1>
                        <p className="text-sm text-foreground-muted mt-3 leading-relaxed">
                            Sign in to the admin dashboard
                        </p>
                    </div>

                    {/* Username/Password Form */}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">

                        <div>
                            <label className="block text-xs font-display text-foreground-muted mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
                                    className="w-full bg-background border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-display text-foreground-muted mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-background border border-border pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!!signingIn || !username.trim() || !password.trim()}
                            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3.5 bg-primary text-primary-foreground font-display text-sm font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {signingIn === "password" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            {signingIn === "password" ? "Processing..." : "Sign In"}
                        </button>


                    </form>



                    {/* Footer info */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
                            <span className="text-[10px] text-accent font-mono uppercase tracking-wider">
                                Secure authentication
                            </span>
                        </div>
                    </div>
                </div>

                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-primary" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-primary" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-primary" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-primary" />
            </div>
        </div>
    );
}
