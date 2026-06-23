import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        plum: '#2C1A4A',
        gold: '#C4955A',
        ivory: '#F7F2EC',
        muted: '#6B5A72',
        light: '#FAF6F0',
        green: '#1A3A2E',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['"Jost"', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.28em',
      },
    },
  },
  plugins: [],
};

export default config;
