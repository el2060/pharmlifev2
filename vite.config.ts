import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use build time instead of commit time for reliability across deployment environments
const buildDate = new Date().toLocaleString('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  timeZone: 'Asia/Singapore'
})

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __COMMIT_DATE__: JSON.stringify(buildDate),
  },
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
