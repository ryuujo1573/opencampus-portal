import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui, typography()],
};
