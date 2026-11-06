/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutrals
        mist: "#F5F6F7",
        ice: "#E6F5F7",
        // Structural
        navy: "#0E1E3A",
        deep: "#003C51",
        // Interactive / data accents
        teal: "#00798A",
        cyan: "#0097AC",
        aqua: "#4DB7C5",
        // Semantic fact-check states (kept muted to sit alongside the palette)
        coral: "#B4493F",
        amber: "#B7791F",
      },
      fontFamily: {
        // Sans for interface and body UI text
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        // Serif for headlines and standfirsts (editorial feel)
        serif: ["Georgia", "Times New Roman", "serif"],
      },
    },
  },
  plugins: [],
};
