import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tauri: use a fixed port so tauri.conf.json devUrl stays correct
  server: {
    port: 5173,
    strictPort: true,
    // Don't open the browser when Tauri opens its own window
    open: false,
  },
  // Tauri expects a relative base path for bundled assets
  base: './',
})
