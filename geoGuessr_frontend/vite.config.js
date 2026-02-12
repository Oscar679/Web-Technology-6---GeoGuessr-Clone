/**
 * @file vite.config.js
 * @description vite.config module.
 */
import { defineConfig } from 'vite'
import { loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: env.VITE_APP_BASE_PATH || '/',
    server: {
      proxy: {
        '/backend': {
          target: 'http://127.0.0.1/oe222ia/geoguessr_backend',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/backend/, ''),
        },
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html'),
          game: resolve(__dirname, 'Game.html'),
          gameComplete: resolve(__dirname, 'GameComplete.html'),
          leaderboard: resolve(__dirname, 'Leaderboard.html'),
          logIn: resolve(__dirname, 'logIn.html'),
          matchHistory: resolve(__dirname, 'MatchHistory.html'),
          signUp: resolve(__dirname, 'signUp.html'),
        },
      },
    },
    plugins: [tailwindcss()],
  }
})
