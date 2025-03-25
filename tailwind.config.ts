import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'
// import plugin from 'tailwindcss/plugin'

export default <Config> {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          red: "#e21c21",
          navy: "#172b4d",
          orange: "#ff8f00",
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
