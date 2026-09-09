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
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          cyan:   '#00e5ff',
          violet: '#7c3aed',
          purple: '#a855f7',
          blue:   '#3b82f6',
        },
        surface: {
          DEFAULT: '#0a0a0f',
          card:    '#0c0c14',
          border:  '#1a1a2e',
          hover:   '#141420',
        },
      },
      backgroundImage: {
        'gradient-brand':   'linear-gradient(135deg, #00e5ff 0%, #7c3aed 100%)',
        'gradient-card':    'linear-gradient(180deg, #0e0e18 0%, #080810 100%)',
        'gradient-hero':    'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124,58,237,0.20) 0%, transparent 70%)',
      },
      boxShadow: {
        'neon-cyan':   '0 0 24px 0 rgba(0,229,255,0.25), 0 0 64px 0 rgba(0,229,255,0.10)',
        'neon-violet': '0 0 24px 0 rgba(124,58,237,0.35), 0 0 64px 0 rgba(124,58,237,0.12)',
        'card-glow':   '0 2px 40px 0 rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.04)',
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
