import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import unConfig from "./uno.config"

console.log(`----->`)
export default defineConfig({
  plugins: [
    UnoCSS(unConfig),
  ],
})
