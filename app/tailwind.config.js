module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        "token-card": "#9FC6EE",
        "green-btn": "#B2E59F",
        "token-amount": "#DCB4B3",
        "red-btn": "#EE9FEE",
        "offer-card": "#EEC79F",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
