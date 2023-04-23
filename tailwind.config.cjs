/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  extend: {
    gridTemplateColumns: {
      shell: "10em 1fr",
    },
    gridTemplateRows: {
      shell: "4em 1fr",
    },
  },
  plugins: [],
};
