/**
 * @file vite.config.js
 * @description vite.config module.
 */
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})

