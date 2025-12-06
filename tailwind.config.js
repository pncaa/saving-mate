/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",

    // Untuk Ionic React class internal
    "node_modules/@ionic/react/**/*.js",
  ],

  theme: {
    extend: {},
  },

  plugins: [],
};
