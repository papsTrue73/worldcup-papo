import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react()],
    define: {
      WCENV_FOOTBALL: JSON.stringify(env.VITE_FOOTBALL_API_KEY || ""),
      WCENV_BSD: JSON.stringify(env.VITE_BSD_API_KEY || ""),
      WCENV_SHEET: JSON.stringify(env.VITE_GOOGLE_SHEET_ID || ""),
    }
  }
})
