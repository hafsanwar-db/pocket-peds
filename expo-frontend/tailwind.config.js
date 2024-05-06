/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./screens/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:"#3D85C6",
        secondary: "#FDB623",
      },
    },
  },
  plugins: [],
}

