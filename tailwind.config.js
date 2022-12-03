/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/js/**/*.{html,vue,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
