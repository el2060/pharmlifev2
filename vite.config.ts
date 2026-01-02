import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'child_process'

const commitDate = execSync('git log -1 --format=%cd --date=format:"%d %b %Y %I:%M %p"').toString().trimEnd()

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
