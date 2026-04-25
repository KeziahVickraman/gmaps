/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        'bg': '#F7F6F3',
        'surface': '#FFFFFF',
        'surface-raised': '#EFEFED',
        'primary': '#1A6B4A',
        'primary-light': '#E8F5EE',
        'accent': '#E85D26',
        'text-primary': '#141414',
        'text-secondary': '#6B6B6B',
        'text-muted': '#ABABAB',
        'border': '#E2E1DE',
        'error': '#CC2B2B',
        'warning': '#D97706',
        'success': '#1A6B4A',
      },
      borderRadius: {
        'card': '12px',
        'chip': '999px',
        'btn': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
}

