/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: { colors: {
      'brown': {
        50: '#EDE7DF',
        100: '#E5D9CC',
        200: '#D6C1A9',
        300: '#C6A787',
        400: '#B78966',
        500: '#A66C45',
        600: '#955E33',
        700: '#844F22',
        800: '#733F11',
        900: '#622F00'
      }
    } },
  },
  plugins: [],
}
