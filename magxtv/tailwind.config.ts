import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070F",
          900: "#0A0E27",
          800: "#0F1535",
          700: "#161D45",
          600: "#202A5C"
        },
        accent: {
          blue: "#3B82F6",
          cyan: "#22D3EE",
          violet: "#8B5CF6",
          magenta: "#EC4899"
        },
        live: "#F43F5E"
      },
      fontFamily: {
        display: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 55%, #EC4899 100%)",
        "radial-glow": "radial-gradient(circle at top, rgba(139,92,246,0.25), transparent 60%)"
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(139,92,246,0.45)"
      }
    }
  },
  plugins: []
};

export default config;
