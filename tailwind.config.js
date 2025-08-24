/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx,js,jsx,mdx}',
    './components/**/*.{ts,tsx,js,jsx,mdx}',
    './src/**/*.{ts,tsx,js,jsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--txt-high)',
        card: 'var(--surface)',
        'card-foreground': 'var(--txt-high)',
        muted: 'var(--surface2)',
        'muted-foreground': 'var(--txt-med)',
        border: 'var(--border)',
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--txt-high)' },
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        xl: 'var(--radius)',
        lg: 'calc(var(--radius) - 2px)',
      },
    },
  },
  plugins: [],
}
