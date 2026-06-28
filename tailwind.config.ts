import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        memo: "0 14px 30px -20px rgb(15 23 42 / 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
