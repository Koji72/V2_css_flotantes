import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'inherit',
            },
            code: {
              color: 'inherit',
              backgroundColor: 'rgb(0 0 0 / 0.1)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: 'rgb(0 0 0 / 0.1)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflowX: 'auto',
            },
          },
        },
      },
      colors: {
        primary: {
          DEFAULT: "#0070f3",
          50: "#f0f7ff",
          100: "#e0eefe",
          200: "#bae0fd",
          300: "#7bc9fc",
          400: "#36b2f8",
          500: "#0c96eb",
          600: "#0070f3",
          700: "#015bc4",
          800: "#0356b0",
          900: "#024a93",
          950: "#022f5f",
        },
        panel: {
          bg: 'var(--panel-bg, #ffffff)',
          border: 'var(--panel-border, #e0e0e0)',
          text: 'var(--panel-text, #333333)',
        },
        button: {
          primary: 'var(--button-primary, #0070f3)',
          secondary: 'var(--button-secondary, #6c757d)',
          success: 'var(--button-success, #28a745)',
          warning: 'var(--button-warning, #ffc107)',
          danger: 'var(--button-danger, #dc3545)',
          info: 'var(--button-info, #17a2b8)',
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config; 