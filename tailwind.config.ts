import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // spacing: {
      //   timeline: "var(--timeline-padding)",
      //   "timeline-plus-1": "calc(var(--timeline-padding) + 1rem)",
      // },
    },
  },
  plugins: [],
};
export default config;
