import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1440px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Space Grotesk', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                border: "hsl(var(--border))",
                "border-subtle": "hsl(var(--border-subtle))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: {
                    DEFAULT: "hsl(var(--background))",
                    secondary: "hsl(var(--background-secondary))",
                    tertiary: "hsl(var(--background-tertiary))",
                    elevated: "hsl(var(--background-elevated))",
                },
                foreground: {
                    DEFAULT: "hsl(var(--foreground))",
                    secondary: "hsl(var(--foreground-secondary))",
                    muted: "hsl(var(--foreground-muted))",
                    subtle: "hsl(var(--foreground-subtle))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                gold: {
                    DEFAULT: "hsl(var(--gold))",
                    foreground: "hsl(var(--gold-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                    border: "hsl(var(--card-border))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
                cyan: {
                    DEFAULT: "#00f5ff",
                    dark: "#00c4cc",
                    light: "#66f9ff",
                },
                neon: {
                    blue: "#0091ff",
                    green: "#00ff88",
                    pink: "#ff0080",
                    gold: "#ffd700",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "var(--radius)",
                sm: "var(--radius)",
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            boxShadow: {
                'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.5), 0 0 40px rgba(0, 245, 255, 0.3)',
                'glow-green': '0 0 20px rgba(0, 255, 136, 0.5), 0 0 40px rgba(0, 255, 136, 0.3)',
                'glow-pink': '0 0 20px rgba(255, 0, 128, 0.5), 0 0 40px rgba(255, 0, 128, 0.3)',
                'glow-gold': '0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.3)',
                'inner-glow': 'inset 0 0 40px rgba(0, 245, 255, 0.05)',
                'card': '0 8px 32px rgba(0, 0, 0, 0.4)',
                'card-hover': '0 16px 48px rgba(0, 0, 0, 0.6)',
            },
            backgroundImage: {
                'gradient-cyber': 'linear-gradient(135deg, #00f5ff, #0091ff)',
                'gradient-matrix': 'linear-gradient(135deg, #00ff88, #00f5ff)',
                'gradient-sunset': 'linear-gradient(135deg, #ff0080, #ffd700)',
                'gradient-dark': 'linear-gradient(180deg, rgba(10,10,10,0.95), rgba(10,10,10,0.85))',
                'gradient-radial-cyan': 'radial-gradient(circle at center, rgba(0,245,255,0.15), transparent)',
            },
            typography: {
                DEFAULT: {
                    css: {
                        '--tw-prose-body': 'hsl(0 0% 80%)',
                        '--tw-prose-headings': 'hsl(0 0% 100%)',
                        '--tw-prose-links': 'hsl(186 100% 50%)',
                        '--tw-prose-bold': 'hsl(0 0% 100%)',
                        '--tw-prose-code': 'hsl(186 100% 50%)',
                        '--tw-prose-pre-bg': 'hsl(0 0% 7%)',
                        '--tw-prose-pre-code': 'hsl(0 0% 80%)',
                        '--tw-prose-quotes': 'hsl(0 0% 60%)',
                        '--tw-prose-quote-borders': 'hsl(186 100% 50%)',
                        '--tw-prose-hr': 'hsl(0 0% 15%)',
                        '--tw-prose-th-borders': 'hsl(0 0% 15%)',
                        '--tw-prose-td-borders': 'hsl(0 0% 10%)',
                        'maxWidth': 'none',
                    },
                },
            },
        },
    },
    plugins: [
        require("@tailwindcss/typography"),
    ],
} satisfies Config;
