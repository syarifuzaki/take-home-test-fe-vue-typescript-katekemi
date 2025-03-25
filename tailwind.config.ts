import defaultTheme from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'
// import plugin from 'tailwindcss/plugin'

export default <Config> {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
