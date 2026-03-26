import { Link } from "react-router-dom";
import { TrendingUp, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerLinks = {
    navigation: [
        { label: "Home", href: "/" },
        { label: "Blog", href: "/blog" },
        { label: "Tags", href: "/tags" },
        { label: "Search", href: "/search" },
    ],
    resources: [
        { label: "Main Site", href: "https://rochitsingh.com", external: true },
        { label: "Courses", href: "https://rochitsingh.com/courses", external: true },
        { label: "Mentorship", href: "https://rochitsingh.com/mentorship", external: true },
        { label: "Investor Charter", href: "https://rochitsingh.com/investor-charter", external: true },
        { label: "Contact", href: "https://rochitsingh.com/contact", external: true },
        { label: "Admin Dashboard", href: "/admin", external: false },
        { label: "RSS Feed", href: "/rss", external: false },
    ],
};

const socialLinks = [
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "#", label: "Email" },
];

export default function Footer() {
    return (
        <footer className="relative bg-background border-t-2 border-border">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-8">
                    {/* About Column */}
                    <div className="lg:col-span-2">
                        <a href="https://rochitsingh.com" className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 border border-primary flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-primary" />
                            </div>
                            <span className="font-display text-lg font-bold text-foreground tracking-tight">
                                ROCHIT<span className="text-primary">SINGH</span>
                            </span>
                        </a>
                        <p className="text-sm text-foreground-muted leading-relaxed max-w-md">
                            Trading insights, market analysis, and actionable ideas.
                            Navigate the markets with precision and discipline.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-display text-xs sm:text-sm font-semibold text-foreground uppercase tracking-widest mb-4 sm:mb-6 pb-3 border-b border-primary">
                            Navigation
                        </h4>
                        <ul className="space-y-3 sm:space-y-4">
                            {footerLinks.navigation.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        to={link.href}
                                        className="text-xs sm:text-sm text-foreground-muted hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-display text-xs sm:text-sm font-semibold text-foreground uppercase tracking-widest mb-4 sm:mb-6 pb-3 border-b border-primary">
                            Main Site
                        </h4>
                        <ul className="space-y-3 sm:space-y-4">
                            {footerLinks.resources.map((link) => (
                                <li key={link.label}>
                                    {link.external ? (
                                        <a
                                            href={link.href}
                                            className="text-xs sm:text-sm text-foreground-muted hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                                        >
                                            {link.label}
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-xs sm:text-sm text-foreground-muted hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                                        >
                                            {link.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-display text-xs sm:text-sm font-semibold text-foreground uppercase tracking-widest mb-4 sm:mb-6 pb-3 border-b border-primary">
                            Connect
                        </h4>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-12 h-12 border border-border flex items-center justify-center text-foreground-subtle hover:border-primary hover:text-primary transition-all duration-300"
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 sm:mt-16 pt-6 sm:pt-8 border-t border-border flex flex-col items-center justify-between gap-4 sm:gap-6">
                    <p className="text-xs sm:text-sm text-foreground-subtle">
                        © {new Date().getFullYear()} Rochit Singh. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
