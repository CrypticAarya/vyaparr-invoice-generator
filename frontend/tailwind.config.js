/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'v-bg': '#F6F3EE',
        'v-text': '#111111',
        'v-accent': '#6D5EF5',
        'v-lavender': '#E8E7FF',
        'v-mint': '#E2F4E9',
        'v-sky': '#E1F0FF',
        'v-peach': '#FFEDE2',
        'v-cream': '#FFF9F0',
      },
      borderRadius: {
        '3xl': '28px',
        '4xl': '36px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        handwritten: ['Kalam', 'cursive'],
      },
    },
  },
  plugins: [],
}

