import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
      port: 56319,
    proxy: {
      '/api': {
        target: 'https://localhost:7211', // ✅ Backend portu güncellendi
        changeOrigin: true,
        secure: false,
      },
    },
  },
})