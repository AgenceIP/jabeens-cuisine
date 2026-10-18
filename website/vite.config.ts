import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { existsSync } from 'fs'
import compression from 'vite-plugin-compression2'

export default defineConfig(({ isSsrBuild }) => ({
  // the prerender build (dist-ssr) only needs the code: no public files, no compressed copies
  plugins: [
    react(),
    // `vite preview` serves the prerendered /menu/index.html at /menu, like the vercel.json rewrites
    {
      name: 'prerendered-pages',
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          const p = req.url?.split('?')[0] ?? '/'
          if (p !== '/' && !p.includes('.') && existsSync(`dist${p}/index.html`)) req.url = `${p}/index.html`
          next()
        })
      },
    },
    !isSsrBuild && compression({ algorithms: ['gzip'], exclude: [/\.(mp4|webm|png|jpg|jpeg|webp|gif|ico)$/] }),
    !isSsrBuild && compression({ algorithms: ['brotliCompress'], exclude: [/\.(mp4|webm|png|jpg|jpeg|webp|gif|ico)$/] }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  build: {
    copyPublicDir: !isSsrBuild,
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
}))
