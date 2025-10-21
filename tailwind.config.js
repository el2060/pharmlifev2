/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        'pharm-blue': '#4A90E2',
        'pharm-green': '#7ED321',
        'pharm-orange': '#F5A623',
        'pharm-red': '#D0021B',
        'pharm-purple': '#9013FE',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'game': ['Poppins', 'sans-serif'],
      },
      animation: {
        'stamp': 'stamp 0.3s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        stamp: {
          '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}
