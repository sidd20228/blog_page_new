import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useNavigate, useLocation } from "react-router-dom";
import { PenTool, Github, Loader2, Mail, Lock, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signIn } = useAuthActions();
    const { isAuthenticated, isLoading } = useConvexAuth();
    const [signingIn, setSigningIn] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");

    const from = (location.state as any)?.from?.pathname || "/admin/dashboard";

    // Redirect to admin when authenticated
    useEffect(() => {
        if (isAuthenticated && !isLoading) {
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, isLoading, navigate, from]);

    const handleOAuthSignIn = async (provider: string) => {
        setSigningIn(provider);
        try {
            await signIn(provider, { redirectTo: "/login" });
        } catch (err) {
            console.error(`${provider} sign-in failed:`, err);
            toast.error(`${provider} sign-in failed`);
            setSigningIn(null);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;

        setSigningIn("password");
        try {
            const formData = new FormData();
            formData.set("email", email.trim());
            formData.set("password", password);
            formData.set("flow", isSignUp ? "signUp" : "signIn");
            if (isSignUp && name.trim()) {
                formData.set("name", name.trim());
            }

            await signIn("password", formData);
        } catch (err: any) {
            console.error("Password sign-in failed:", err);
            toast.error(
                isSignUp
                    ? "Sign up failed. This email may already be registered."
                    : "Invalid email or password."
            );
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
                        <div className="w-16 h-16 border-2 border-primary flex items-center justify-center mx-auto mb-5 hover:shadow-glow-cyan transition-shadow duration-500">
                            <PenTool className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-foreground tracking-tight">
                            BLOG<span className="text-primary">CMS</span>
                        </h1>
                        <p className="text-sm text-foreground-muted mt-3 leading-relaxed">
                            {isSignUp ? "Create an admin account" : "Sign in to the admin dashboard"}
                        </p>
                    </div>

                    {/* Email/Password Form */}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {isSignUp && (
                            <div>
                                <label className="block text-xs font-display text-foreground-muted mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your display name"
                                    className="w-full bg-background border border-border px-4 py-3 text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none focus:border-primary transition-colors"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-display text-foreground-muted mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-subtle" />
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
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
                            disabled={!!signingIn || !email.trim() || !password.trim()}
                            className="w-full inline-flex items-center justify-center gap-3 px-4 py-3.5 bg-primary text-primary-foreground font-display text-sm font-medium hover:shadow-glow-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {signingIn === "password" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <LogIn className="w-5 h-5" />
                            )}
                            {signingIn === "password"
                                ? "Processing..."
                                : isSignUp
                                    ? "Create Account"
                                    : "Sign In"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="w-full text-xs text-foreground-subtle hover:text-primary transition-colors font-display"
                        >
                            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-card text-[10px] text-foreground-subtle font-mono uppercase tracking-widest">
                                or continue with
                            </span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleOAuthSignIn("github")}
                            disabled={!!signingIn}
                            className="inline-flex items-center justify-center gap-2 px-3 py-3 bg-[#24292f] text-white font-display text-sm font-medium hover:bg-[#1c2127] transition-all duration-300 disabled:opacity-50 group"
                        >
                            {signingIn === "github" ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            )}
                            GitHub
                        </button>
                        <button
                            onClick={() => handleOAuthSignIn("google")}
                            disabled={!!signingIn}
                            className="inline-flex items-center justify-center gap-2 px-3 py-3 bg-white text-gray-800 font-display text-sm font-medium hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 group"
                        >
                            {signingIn === "google" ? (
                                <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                            ) : (
                                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                            )}
                            Google
                        </button>
                    </div>

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
