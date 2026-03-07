/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fdf8f0',
          100: '#faefd8',
          200: '#f4dbb0',
          300: '#ecc07e',
          400: '#e29e4a',
          500: '#d4832a',
          600: '#b8681e',
          700: '#9a501a',
          800: '#7d401b',
          900: '#673719',
          950: '#371a0a',
        },
        deep: {
          900: '#0f0e17',
          800: '#1a1828',
          700: '#252340',
          600: '#2e2b54',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bar-grow': 'barGrow 0.6s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px rgba(212,131,42,0.3)' },
          'to': { boxShadow: '0 0 25px rgba(212,131,42,0.7)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        barGrow: {
          'from': { transform: 'scaleY(0)', opacity: '0' },
          'to': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
