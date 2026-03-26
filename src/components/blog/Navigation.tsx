import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Search, TrendingUp, ExternalLink } from "lucide-react";
import { cn } from "../../lib/utils";

const navLinks = [
    { label: "Blog", href: "/blog" },
    { label: "Tags", href: "/tags" },
];

export default function Navigation() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "bg-background/90 backdrop-blur-xl border-b border-border"
                        : "bg-transparent"
                )}
            >
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <a href="https://rochitsingh.com" className="flex items-center gap-2 sm:gap-3 group">
                            <div className="w-8 sm:w-10 h-8 sm:h-10 border border-primary flex items-center justify-center transition-shadow duration-300">
                                <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                            </div>
                            <span className="font-display text-lg sm:text-xl font-bold text-foreground tracking-tight">
                                ROCHIT<span className="text-primary">SINGH</span>
                            </span>
                        </a>

                        <nav className="hidden lg:flex items-center gap-8">
                            <a
                                href="https://rochitsingh.com"
                                className="relative font-display text-sm font-medium text-foreground-muted hover:text-primary transition-colors duration-300 group flex items-center gap-1.5"
                            >
                                Main Site
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </a>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    to={link.href}
                                    className={cn(
                                        "relative font-display text-sm font-medium transition-colors duration-300 group",
                                        location.pathname === link.href
                                            ? "text-primary"
                                            : "text-foreground-muted hover:text-primary"
                                    )}
                                >
                                    {link.label}
                                    <span
                                        className={cn(
                                            "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                                            location.pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                                        )}
                                    />
                                </Link>
                            ))}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden lg:flex items-center gap-4">
                            <Link
                                to="/search"
                                className="w-10 h-10 border border-border flex items-center justify-center text-foreground-muted hover:border-primary hover:text-primary transition-all duration-300"
                            >
                                <Search className="w-4 h-4" />
                            </Link>
                            
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden w-10 h-10 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-50 bg-background transition-transform duration-500 lg:hidden",
                    isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="container mx-auto px-6 py-6">
                    <div className="flex items-center justify-between mb-16">
                        <a href="https://rochitsingh.com" className="flex items-center gap-3">
                            <div className="w-10 h-10 border border-primary flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-display text-xl font-bold text-foreground tracking-tight">
                                ROCHIT<span className="text-primary">SINGH</span>
                            </span>
                        </a>
                        <button
                            className="w-10 h-10 border border-border flex items-center justify-center text-foreground hover:border-primary hover:text-primary transition-colors duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="flex flex-col gap-6">
                        <a
                            href="https://rochitsingh.com"
                            className="font-display text-3xl font-bold text-foreground hover:text-primary transition-colors duration-300 opacity-0 animate-fade-in-left flex items-center gap-3"
                            style={{ animationDelay: "50ms", animationFillMode: "forwards" }}
                        >
                            Main Site
                            <ExternalLink className="w-6 h-6 text-foreground-muted" />
                        </a>
                        {navLinks.map((link, index) => (
                            <Link
                                key={link.label}
                                to={link.href}
                                className="font-display text-3xl font-bold text-foreground hover:text-primary transition-colors duration-300 opacity-0 animate-fade-in-left"
                                style={{
                                    animationDelay: `${index * 100}ms`,
                                    animationFillMode: "forwards",
                                }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-12 flex flex-col gap-4">
                        <Link
                            to="/search"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 border border-border text-foreground font-display text-sm font-medium hover:border-primary hover:text-primary transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Link>
                        <Link
                            to="/admin"
                            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 bg-primary text-primary-foreground font-display text-sm font-medium transition-all duration-300"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Admin Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
