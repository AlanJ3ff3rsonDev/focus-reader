import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030308',
          900: '#05050a',
          800: '#0a0a12',
          700: '#10101c',
          600: '#161626',
          500: '#1c1c30',
        },
        accent: {
          cyan: '#4fd1c5',
          teal: '#38b2ac',
          glow: '#5ce1d5',
        },
        orp: {
          red: '#ef4444',
          glow: '#f87171',
        }
      },
      fontFamily: {
        display: ['var(--font-geist-sans)', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'aurora': 'linear-gradient(135deg, rgba(79, 209, 197, 0.06) 0%, rgba(56, 178, 172, 0.03) 50%, transparent 100%)',
        'glow-cyan': 'radial-gradient(ellipse at center, rgba(79, 209, 197, 0.12) 0%, transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'dial-pulse': 'dialPulse 2s ease-in-out infinite',
        'word-enter': 'wordEnter 0.08s ease-out forwards',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        dialPulse: {
          '0%, 100%': { boxShadow: '0 0 30px rgba(79, 209, 197, 0.2), inset 0 0 20px rgba(79, 209, 197, 0.05)' },
          '50%': { boxShadow: '0 0 50px rgba(79, 209, 197, 0.35), inset 0 0 30px rgba(79, 209, 197, 0.1)' },
        },
        wordEnter: {
          '0%': { opacity: '0.7', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'glow-cyan': '0 0 40px rgba(79, 209, 197, 0.25)',
        'glow-red': '0 0 25px rgba(239, 68, 68, 0.35)',
        'btn': '0 4px 14px rgba(0, 0, 0, 0.4)',
        'btn-active': '0 2px 8px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
};
export default config;
