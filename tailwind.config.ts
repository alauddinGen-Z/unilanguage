import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#FF6B00",
                    light: "#FF8800",
                    dark: "#E55F00",
                },
                secondary: {
                    DEFAULT: "#1A1A1A",
                    light: "#2A2A2A",
                },
            },
            borderRadius: {
                '2xl': '1rem',
                '3xl': '1.5rem',
            },
            boxShadow: {
                'card': '0 4px 20px rgba(255, 107, 0, 0.1)',
                'card-hover': '0 8px 30px rgba(255, 107, 0, 0.2)',
            },
            backgroundImage: {
                'gradient-orange': 'linear-gradient(135deg, #FF6B00 0%, #FF8800 100%)',
            },
        },
    },
    plugins: [],
};
export default config;
