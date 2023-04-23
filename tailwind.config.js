const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        turquoise: "#56B1B6",
        purple: "#7556B6",
        yellow: "#FCBF72",
        orange: "#FF5A44",
        teal: "#306F73",
        dark: "#504E4E",
        "turquoise-dark": "#4AA1A6",
        "blue-dark": "#112630",
        grey: "#9E9E9E",
        "light-grey": "#F0F0F0",
        lighter: "F7F7F7",
      },
    },
    fontFamily: {
      sans: ["var(--font-manrope)", ...fontFamily.sans],
    },
  },
  plugins: [],
};
