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
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
          800: '#78350f',
          900: '#451a03',
          950: '#2a1700',
        },
        deep: {
          900: '#0c0b0a',
          800: '#141312',
          700: '#1c1917',
          600: '#292524',
          500: '#44403c',
        },
        surface: {
          DEFAULT: '#141312',
          dim: '#0c0b0a',
          container: '#1c1917',
          high: '#292524',
          highest: '#44403c',
          low: '#1c1b1a',
          lowest: '#0c0b0a',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
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
          'from': { boxShadow: '0 0 10px rgba(217,119,6,0.3)' },
          'to': { boxShadow: '0 0 25px rgba(217,119,6,0.7)' },
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
