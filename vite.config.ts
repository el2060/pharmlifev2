import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const commitIso = execSync('git log -1 --format=%cI').toString().trimEnd()
const commitDate = new Date(commitIso).toLocaleString('en-GB', {
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
    __COMMIT_DATE__: JSON.stringify(commitDate),
  },
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
