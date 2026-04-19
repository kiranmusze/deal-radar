import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // In dev, proxy /api/proxy/* → OpenRegister directly (bypasses CORS)
      '/api/proxy': {
        target: 'https://api.openregister.de',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/proxy/, ''),
      },
    },
  },
})
