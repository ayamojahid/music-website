/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1DB954',
        secondary: '#191414',
        accent: '#1ED760',
        dark: {
          50: '#0f172a',
          100: '#1e293b',
          200: '#334155'
        },
        card: '#181818',
        text: '#FFFFFF',
        textMuted: '#B3B3B3',
      },
      animation: {
        'pulse-slow': 'pulse 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}