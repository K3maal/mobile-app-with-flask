import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // makes the app reachable from other devices on the same wifi
    port: 5173
  }
})
