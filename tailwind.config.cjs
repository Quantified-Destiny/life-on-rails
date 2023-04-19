/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  extend: {
    fontFamily: {
      roboto: ["Roboto", "sans-serif"],
    },
    gridTemplateColumns: {
      shell: "10em 1fr",
    },
    gridTemplateRows: {
      shell: "4em 1fr",
    },
  },
  plugins: [],
};
