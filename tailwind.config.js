/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myspot: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
          primary: '#6366F1',
          primaryDark: '#4F46E5',
          accent: '#8B5CF6',
          glow: '#A78BFA',
          bgLight: '#F8F9FE',
          cardLight: '#FFFFFF',
          darkText: '#1E1B4B',
          mutedText: '#6B7280',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(99, 102, 241, 0.08)',
        'card': '0 12px 36px -4px rgba(79, 70, 229, 0.12)',
        'glow': '0 0 25px rgba(124, 58, 237, 0.35)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.45)',
        'nav': '0 10px 30px -5px rgba(99, 102, 241, 0.3)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
