import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f2f9f7',
          100: '#d4efe7',
          200: '#a8dece',
          300: '#75c6b1',
          400: '#43aa93',
          500: '#1f8f7a',
          600: '#137262',
          700: '#0f5a50',
          800: '#0d4840',
          900: '#0b3b34',
        },
        accent: {
          50: '#fff7ed',
          100: '#ffebc6',
          200: '#ffd08a',
          300: '#ffb151',
          400: '#ff9031',
          500: '#f46d13',
          600: '#d64e0c',
          700: '#b1390d',
          800: '#8b2f10',
          900: '#6f2811',
        },
        midnight: '#0f172a',
      },
      fontFamily: {
        display: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        glow: '0 10px 40px rgba(31, 143, 122, 0.25)',
      },
      backgroundImage: {
        'grid-overlay':
          'radial-gradient(circle at 1px 1px, rgba(79, 70, 229, 0.12) 1px, transparent 0)',
      },
    },
  },
  plugins: [forms],
}
