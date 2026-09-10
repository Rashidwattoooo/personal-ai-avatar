import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Agentix System brand palette (purple primary, green secondary)
        brand: {
          cyan:   '#6c5ce7', // primary purple
          violet: '#4b3fc4', // deep purple (gradient depth)
          purple: '#8b7cf0', // light purple
          blue:   '#0f9d67', // green secondary accent
        },
        ink: {
          DEFAULT: '#14161c', // primary text
          muted:   '#5b6472', // muted text
          faint:   '#8a92a1', // faint text
        },
        surface: {
          DEFAULT: '#ffffff',
          card:    '#ffffff',
          border:  '#e6e8ee',
          hover:   '#f4f5f8',
          subtle:  '#f6f7f9',
        },
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #6c5ce7 0%, #4b3fc4 100%)',
        'gradient-card':    'linear-gradient(180deg, #ffffff 0%, #f6f7f9 100%)',
        'gradient-hero':    'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,92,231,0.10) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-cyan':   '0 8px 24px 0 rgba(108,92,231,0.22), 0 2px 8px 0 rgba(108,92,231,0.10)',
        'neon-violet': '0 8px 24px 0 rgba(75,63,196,0.22), 0 2px 8px 0 rgba(75,63,196,0.10)',
        'card-glow':   '0 4px 24px 0 rgba(20,22,28,0.06), 0 1px 3px 0 rgba(20,22,28,0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':  'spin 8s linear infinite',
        'float':      'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
