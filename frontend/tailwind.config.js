/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'color-blink': 'colorBlink 3s linear infinite',
      },
      keyframes: {
        colorBlink: {
          '0%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 0%' },
          '100%': { backgroundPosition: '0% 0%' },
        },
      },
      colors: {
        'light-blue': '#3b82f6',
        'dark-pink': '#9b1c5c',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}
