/**
 * @file vite.config.js
 * @description vite.config module.
 */
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/backend': {
        target: 'http://127.0.0.1/oe222ia/geoguessr_backend',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    }
  },
  plugins: [tailwindcss()],
})
