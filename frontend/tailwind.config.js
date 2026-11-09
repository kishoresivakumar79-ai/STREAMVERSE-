/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        stream: {
          dark: "#0b0e14",
          card: "#151922",
          accent: "#e50914",
          gold: "#eab308",
          purple: "#7c3aed",
          blue: "#0284c7"
        }
      }
    },
  },
  plugins: [],
};

