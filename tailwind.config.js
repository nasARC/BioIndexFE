/** @type {import('tailwindcss').Config} */

const {heroui} = require("@heroui/react");

export default {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "border": "#364049",
        "border-transparent": "#36404900",
        "mozaic": "#1E1E24",
        "mozaic-30": "#1E1E2477"
      },
      screens: {
        'se': {'raw': '(max-height: 780px) and (max-width:768px)'},
        'zfold': {'raw': '(max-width: 350px)'}
      }
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          primary: "#96BA85",
          "primary-dark": "#559046",
          secondary: "#414C58",
          foreground: "white",
          background: "#212121",
          danger: "#f40d30",
          content1: "#262626",
        },
      }
    }
  })],
};