import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
    return (
        <div className="min-h-screen bg-background grid-pattern flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-radial-cyan opacity-10" />
            <div className="relative text-center">
                <h1 className="font-mono text-8xl font-bold text-primary text-glow-cyan mb-4">
                    404
                </h1>
                <p className="font-display text-xl text-foreground mb-2">
                    Page Not Found
                </p>
                <p className="text-sm text-foreground-muted mb-8">
                    The page you're looking for doesn't exist.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display text-sm transition-all group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
