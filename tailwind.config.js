/** @type {import('tailwindcss').Config} */

const reservedColors = [
  "neutral",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "cyan",
  "rose",
  "amber",
];

module.exports = {
  darkMode: 'class',
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    ...reservedColors.flatMap((name) => [
      `text-${name}-500`,
      `bg-${name}-300/10`,
      `dark:bg-${name}-400/10`,
      `bg-${name}-500`,
    ]),
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', '"SF Mono"', '"Fira Code"', 'monospace'],
      },
      colors: {
        printer: {
          body: '#F5F0E8',
          'body-dark': '#2A2520',
          shell: '#E8E0D0',
          'shell-dark': '#3A342C',
          accent: '#FF6B35',
          'accent-dark': '#FF8C5A',
          button: '#D4CBC0',
          'button-dark': '#4A433A',
          'button-active': '#C8BFB4',
          'button-active-dark': '#5A524A',
          paper: '#FFFEF9',
          'paper-dark': '#1E1B18',
          ink: '#2C2824',
          'ink-dark': '#E8E0D0',
          'ink-light': '#8A8078',
          tape: '#F0EDE6',
          'tape-dark': '#252220',
        },
      },
      boxShadow: {
        'printer': '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'printer-dark': '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
        'button': 'inset 0 -2px 0 rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)',
        'button-pressed': 'inset 0 2px 4px rgba(0,0,0,0.1)',
        'paper': '0 1px 3px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
