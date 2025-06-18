module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  darkMode: 'class', // ili 'media' ako želiš automatski prema sistemu
  theme: {
    extend: {
      colors: {
        background: '#121212',
        primary: '#ec4899', // Tailwind pink-500
        text: '#e5e7eb', // Tailwind gray-100
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
