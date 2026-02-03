/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#6d28d9",
          600: "#5b21b6"
        }
      }
    }
  },
  plugins: []
};
