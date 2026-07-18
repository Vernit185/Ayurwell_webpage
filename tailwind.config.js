/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "secondary-bg": "var(--secondary-bg)",
        card: "var(--card)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "secondary-accent": "var(--secondary-accent)",
        text: "var(--text)",
        "secondary-text": "var(--secondary-text)",
        border: "var(--border)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
