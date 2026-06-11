import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // During local development the Express backend runs separately. Proxy /api
  // calls to it so the frontend can use same-origin paths (like in production,
  // where Express serves both the build and the API). Start the backend with
  // PORT=3001 (see docs/lokal-utvikling.md).
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
