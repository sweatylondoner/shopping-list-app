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
        primary: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffd4c6',
          300: '#ffb399',
          400: '#ff9173',
          500: '#f2724d',
          600: '#e25a36',
          700: '#c74829',
          800: '#a33d25',
          900: '#853624',
        },
        cream: {
          50: '#fdfcfa',
          100: '#f9f7f4',
          200: '#f5f2ed',
        },
        brown: {
          600: '#78472c',
          700: '#5c3520',
          800: '#432617',
        },
      },
      minHeight: {
        'touch-target': '44px',
      },
      minWidth: {
        'touch-target': '44px',
      },
    },
  },
  plugins: [],
};
export default config;
