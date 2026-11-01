import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626', // Primary Color
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          dark: '#111827', // Accent Color
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(220, 38, 38, 0.12)',
        'glass-hover': '0 12px 40px 0 rgba(220, 38, 38, 0.22)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
        'card-glow': '0 0 25px rgba(220, 38, 38, 0.25)',
      }
    },
  },
  plugins: [],
};
export default config;
