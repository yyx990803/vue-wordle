import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue({
    reactivityTransform: true
  })],
  build: {
    assetsDir: '.'
  },
  base: '/words/'
})
