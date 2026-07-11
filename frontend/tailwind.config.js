/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#082F49",
          900: "#0C4A6E",
          850: "#075985",
          800: "#0369A1",
          700: "#0284C7",
          600: "#0EA5E9",
        },
        ocean: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          900: "#0C4A6E",
        },
        sand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          500: "#F97316",
          600: "#EA580C",
        },
        gold: {
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
        },
        iris: {
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
        },
        leaf: {
          500: "#10B981",
          600: "#059669",
        },
        line: "rgba(12,74,110,0.14)",
      },
      fontFamily: {
        display: ['"Playfair Display"', "Georgia", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontWeight: {
        400: "400",
        500: "500",
        600: "600",
        700: "700",
        800: "800",
      },
      boxShadow: {
        glow: "0 18px 38px -20px rgba(249,115,22,0.55)",
        "glow-iris": "0 18px 38px -20px rgba(14,165,233,0.55)",
        card: "0 1px 0 0 rgba(255,255,255,0.9) inset, 0 18px 50px -28px rgba(12,74,110,0.35)",
      },
      backgroundImage: {
        "gold-iris": "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 45%, #F97316 100%)",
        "ink-fade": "radial-gradient(900px 420px at 15% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(700px 360px at 85% 10%, rgba(249,115,22,0.16), transparent 55%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
