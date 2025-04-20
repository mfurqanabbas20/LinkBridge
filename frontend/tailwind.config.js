/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        prompt: ['Prompt', 'sans-serif'],
        lexend: ['Lexend', 'sans-serif'],
        lobster: ['Lobster', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif']
      }
    },
  },
  plugins: [],
}

