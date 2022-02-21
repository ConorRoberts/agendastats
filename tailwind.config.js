const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      "sans": ["Inter", "ui-sans-serif", "system-ui"],
    },
    extend: {
      colors: {
        gray: colors.neutral
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}