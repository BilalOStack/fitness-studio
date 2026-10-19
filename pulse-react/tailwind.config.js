/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#e63946',
          'red-dark': '#b52d38',
          amber: '#f4a261',
          bg: '#121220',
          dark: '#1d1d2c',
          surface: '#27273a',
          border: '#3a3a50',
          muted: '#9a9ab0',
          text: '#eaeaf0',
        },
      },
    },
  },
  plugins: [],
}
