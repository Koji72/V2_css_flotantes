/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        'inf-primary': '#00FFFF',
        'inf-accent1': '#00CED1',
        'inf-tertiary': '#808080',
        'inf-secondary': '#000000',
        'inf-accent2': '#FFA500',
      },
      fontFamily: {
        'main': ['Roboto', 'sans-serif'],
        'title': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    // preflight: false, // Comentado o eliminado para habilitar preflight
  }
} 