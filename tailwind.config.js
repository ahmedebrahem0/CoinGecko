/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          background: "#1a202c",
          card: "#2d3748",
          text: "#e2e8f0",
          accent: "#63b3ed",
        },
        light: {
          background: "#f7fafc",
          card: "#ffffff",
          text: "#2d3748",
          accent: "#4299e1",
        },
      },
    },
  },
  plugins: [],
};
