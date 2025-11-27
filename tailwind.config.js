/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gothic: ['"Cinzel"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        blackletter: ['"UnifrakturCook"', 'cursive'],
      },
      colors: {
        dark: {
          950: '#020202',
          900: '#050505',
          800: '#0a0a0a',
          700: '#121212',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ghost-breath': 'ghost 3s ease-in-out infinite alternate',
        'shine': 'shine 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ghost: {
          '0%': { opacity: '0.8', textShadow: '0 0 10px rgba(153, 27, 27, 0.1)' },
          '100%': { opacity: '1', textShadow: '0 0 25px rgba(153, 27, 27, 0.4), 0 0 5px rgba(220, 38, 38, 0.8)' },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        }
      }
    }
  },
  plugins: [],
}