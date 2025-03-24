import type { Config } from 'tailwindcss';

export default {
  darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
          950: 'rgb(var(--color-primary-950) / <alpha-value>)',
        },
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
      full: '9999px',
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
    function ({
      addBase,
    }: {
      addBase: (obj: Record<string, Record<string, string>>) => void;
    }) {
      addBase({
        ':root': {
          '--color-primary-50': '255 239 244',
          '--color-primary-100': '255 224 234',
          '--color-primary-200': '255 198 219',
          '--color-primary-300': '255 151 188',
          '--color-primary-400': '255 93 154',
          '--color-primary-500': '255 36 124',
          '--color-primary-600': '255 0 112',
          '--color-primary-700': '215 0 94',
          '--color-primary-800': '180 0 88',
          '--color-primary-900': '153 2 81',
          '--color-primary-950': '87 0 39',
        },
      });
    },
  ],
} satisfies Config;
