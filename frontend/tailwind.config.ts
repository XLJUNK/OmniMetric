import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                gms: {
                    bg: "#0A0A0A", // Deepest black
                    panel: "#121212", // Slightly lighter panel
                    border: "#2A2A2A", // Subtle border
                    text: "#E0E0E0", // Off-white text
                    muted: "#888888", // Secondary text
                    primary: "#00A3BF", // Bloomberg-ish Blue
                    accent: "#FF6B00", // Bloomberg Orange
                    success: "#00C853", // Matrix/Financial Green
                    danger: "#FF3D00", // Sharp Red
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                mono: ['var(--font-roboto-mono)', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
};
export default config;
