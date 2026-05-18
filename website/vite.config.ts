import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import compression from 'vite-plugin-compression2'

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithms: ['gzip'], exclude: [/\.(mp4|webm|png|jpg|jpeg|webp|gif|ico)$/] }),
    compression({ algorithms: ['brotliCompress'], exclude: [/\.(mp4|webm|png|jpg|jpeg|webp|gif|ico)$/] }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    cssMinify: true,
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
