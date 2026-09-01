import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#0A2540',
          foreground: '#ffffff',
        },
        lime: {
          50: '#FBFFE6',
          100: '#F2FFB3',
          200: '#E7FF80',
          300: '#DDFF4D',
          400: '#D4FF32', // User's vibrant highlighter color
          DEFAULT: '#D4FF32',
          600: '#A3CC00',
        },
        stripe: {
          indigo: '#635BFF',
          dark: '#0A2540',
          cyan: '#00D4FF',
          purple: '#7A73FF',
        },
        cream: {
          50: '#FAF8F5',
          100: '#F4EFE6', // Soft warm sand/card background
          200: '#ECE3D4',
        },
        muted: {
          DEFAULT: '#f4f4f5',
          foreground: '#71717a',
        },
        accent: {
          DEFAULT: '#D4FF32',
          foreground: '#09090b',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        mono: [
          '"SF Mono"',
          'SFMono-Regular',
          'ui-monospace',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
};

export default config;
