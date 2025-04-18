/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        accent1: 'var(--color-accent1)',
        accent2: 'var(--color-accent2)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
      backgroundColor: {
        primary: 'var(--theme-bg-primary)',
        secondary: 'var(--theme-bg-secondary)',
        tertiary: 'var(--theme-bg-tertiary)',
        highlight: 'var(--theme-bg-highlight)',
      },
      textColor: {
        primary: 'var(--theme-text-primary)',
        secondary: 'var(--theme-text-secondary)',
        muted: 'var(--theme-text-muted)',
      },
      borderColor: {
        primary: 'var(--theme-border-color)',
        light: 'var(--theme-border-light)',
        dark: 'var(--theme-border-dark)',
      },
      boxShadow: {
        sm: 'var(--theme-shadow-sm)',
        md: 'var(--theme-shadow-md)',
        lg: 'var(--theme-shadow-lg)',
      },
      spacing: {
        xs: 'var(--spacing-xs)',
        sm: 'var(--spacing-sm)',
        md: 'var(--spacing-md)',
        lg: 'var(--spacing-lg)',
        xl: 'var(--spacing-xl)',
        '2xl': 'var(--spacing-2xl)',
        '3xl': 'var(--spacing-3xl)',
      },
      fontSize: {
        xs: 'var(--font-size-xs)',
        sm: 'var(--font-size-sm)',
        md: 'var(--font-size-md)',
        lg: 'var(--font-size-lg)',
        xl: 'var(--font-size-xl)',
        '2xl': 'var(--font-size-2xl)',
        '3xl': 'var(--font-size-3xl)',
        '4xl': 'var(--font-size-4xl)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
    },
  },
  plugins: [],
} 