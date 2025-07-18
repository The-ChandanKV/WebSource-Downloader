/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          primary: {
            DEFAULT: '#e50914', // Netflix red
            dark: '#b0060f',
          },
          dark: {
            DEFAULT: '#111111',
            light: '#1a1a1a',
          },
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(-4px)' },
            '50%': { transform: 'translateY(4px)' },
          }
        },
        animation: {
          'float-slow': 'float 6s ease-in-out infinite',
        }
      },
    },
    plugins: [],
  }