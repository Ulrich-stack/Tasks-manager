import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0F766E",
          hover: "#115E59",
          soft: "#F0FDFA",
          ring: "#14B8A6",
        },
      },
    },
  },
  plugins: [],
};
export default config;
