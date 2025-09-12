import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui"],
                mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
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
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            spacing: {
                18: "4.5rem",
                88: "22rem",
                128: "32rem",
            },
            animation: {
                "fade-in": "fadeIn 0.5s ease-in-out",
                "slide-up": "slideUp 0.5s ease-out",
                "scale-in": "scaleIn 0.3s ease-out",
                "bounce-subtle": "bounceSubtle 2s infinite",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                scaleIn: {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                bounceSubtle: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
            },
        },
    },
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    plugins: [require("daisyui")],
} as Config & {
    daisyui?: {
        themes: Array<string | Record<string, Record<string, string>>>;
        darkTheme: string;
        base: boolean;
        styled: boolean;
        utils: boolean;
        prefix: string;
        logs: boolean;
        themeRoot: string;
    };
};

// Configuração específica do DaisyUI
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(config as any).daisyui = {
    themes: [
        {
            skillpath: {
                primary: "#3b82f6", // Blue-500
                secondary: "#64748b", // Slate-500
                accent: "#f59e0b", // Amber-500
                neutral: "#1e293b", // Slate-800
                "base-100": "#ffffff", // White
                "base-200": "#f8fafc", // Slate-50
                "base-300": "#e2e8f0", // Slate-200
                info: "#06b6d4", // Cyan-500
                success: "#10b981", // Emerald-500
                warning: "#f59e0b", // Amber-500
                error: "#ef4444", // Red-500
            },
        },
        "light",
        "dark",
        "cupcake",
        "corporate",
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
};

export default config;
