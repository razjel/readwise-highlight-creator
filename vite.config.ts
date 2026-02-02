import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    proxy: {
      '/api/openrouter': {
        target: 'https://openrouter.ai/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/openrouter/, '')
      },
      '/api/readwise-v2': {
        target: 'https://readwise.io/api/v2',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/readwise-v2/, '')
      },
      '/api/readwise': {
        target: 'https://readwise.io/api/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/readwise/, '')
      }
    }
  }
})
