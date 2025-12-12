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
        // Modern pharmacy game palette
        'pharm-primary': '#2E5FA8',   // Deep blue
        'pharm-secondary': '#34D399', // Emerald green
        'pharm-accent': '#F97316',    // Orange
        'pharm-warning': '#EF4444',   // Red
        'pharm-success': '#10B981',   // Green
        'pharm-neutral': '#64748B',   // Slate
        // Legacy Pokemon palette (kept for compatibility)
        'poke-red': '#FF0000',
        'poke-dark-red': '#C80000',
        'poke-yellow': '#FFD700',
        'poke-dark-yellow': '#C8A000',
        'poke-blue': '#3075D8',
        'poke-light-blue': '#58A8F8',
        'poke-black': '#000000',
        'poke-white': '#FFFFFF',
        'poke-gray': '#606060',
        'poke-dark-gray': '#303030',
        'poke-border': '#202020',
        'poke-text': '#000000',
        'pharm-green': '#00A85E',
        'pharm-pill-blue': '#2E5FA8',
        'pharm-pill-pink': '#D81B60',
        'pharm-pill-orange': '#E65100',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'monospace'],
        'sans': ['Poppins', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
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
