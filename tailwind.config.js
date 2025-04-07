/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'md:w-64',
    'md:opacity-100',
    'hidden',
    'md:flex',
    'w-0',
    'opacity-0'
  ]
}
