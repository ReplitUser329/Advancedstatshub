import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00ffea',
        purple: '#8b5cf6',
        pink: '#ec4899',
        dark: '#0c0a1a',
        glass: 'rgba(255,255,255,0.05)',
      },
      fontFamily: {
        display: ['var(--font-sf)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
