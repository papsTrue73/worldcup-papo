import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    define: {
      WCENV_FOOTBALL: JSON.stringify(env.VITE_FOOTBALL_API_KEY || ""),
      WCENV_BSD: JSON.stringify(env.VITE_BSD_API_KEY || ""),
      WCENV_SHEET_USA: JSON.stringify(env.VITE_SHEET_AMIGOS_USA || ""),
      WCENV_SHEET_FAM: JSON.stringify(env.VITE_SHEET_FAMILIA || ""),
      WCENV_SHEET_CO: JSON.stringify(env.VITE_SHEET_AMIGOS_CO || ""),
    },
    server: {
      proxy: {
        '/api/football': {
          target: 'https://api.football-data.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/football/, ''),
        },
        '/api/bsd': {
          target: 'https://sports.bzzoiro.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/bsd/, ''),
        },
      },
    },
  }
})
