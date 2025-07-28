/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'brand-teal': '#2C8B80',
        'brand-teal-light': '#3BA599',
        'brand-teal-dark': '#1F6259',
        'brand-sand': '#F5E6D3',
      },
      fontFamily: {
        'poppins': ['var(--font-poppins)'],
        'playfair': ['var(--font-playfair)'],
      },
    },
  },
  plugins: [],
}