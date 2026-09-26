import type { Config } from 'tailwindcss'

// Colors resolve to CSS variables defined in src/index.css
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        page: token('page'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        tint: token('tint'),
        border: token('border'),
        'border-bright': token('border-bright'),
        muted: token('muted'),
        subtle: token('subtle'),
        body: token('body'),
        heading: token('heading'),
        accent: token('accent'),
        'accent-bright': token('accent-bright'),
        ga: token('ga'),
        preview: token('preview'),
        dev: token('dev'),
        retire: token('retire'),
        azure: {
          DEFAULT: '#0078d4',
          dark: '#005a9e',
          light: '#50e6ff',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI Variable Text"', '"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', '"Helvetica Neue"', 'sans-serif'],
        display: ['"Segoe UI Variable Display"', '"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        mono: ['"Cascadia Code"', '"Cascadia Mono"', 'Consolas', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        // Fluent 2 elevation ramp
        'fluent-2': '0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)',
        'fluent-8': '0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)',
        'fluent-16': '0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
