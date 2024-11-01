/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

export default withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      "primary": "#335aa2",
      "secondary": "#f4f7fe",
      "button-primary": "#335aa2",
      "base-color": "#60A5FA",
      "white-color": "#fff",
      "black-color": "#000"
    },
  },
  plugins: [],
});
