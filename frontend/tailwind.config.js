/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#080C14',
          card: '#0F172A',
          surface: '#111827',
          border: 'rgba(51, 65, 85, 0.6)'
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#0d9488',
          600: '#0f766e',
          700: '#115e59',
        },
        medical: {
          blue: '#0284c7',
          teal: '#0d9488',
          dark: '#080c14',
          light: '#f8fafc',
        }
      },
      fontFamily: {
        bn: ['Hind Siliguri', 'sans-serif'],
        en: ['Inter', 'Plus Jakarta Sans', 'sans-serif'],
        sans: ['Hind Siliguri', 'Inter', 'Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
