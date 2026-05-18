import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('gsap')) return 'gsap'
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
