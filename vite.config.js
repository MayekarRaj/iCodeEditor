import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/iCodeEditor/',
  plugins: [
    react(),
    // dev-only mock plugin: intercepts /api/auth/login and returns a fake token/user
    {
      name: 'dev-mock-auth',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          try {
            if (req.method === 'POST' && req.url && req.url.startsWith('/api/auth/login')) {
              res.setHeader('Content-Type', 'application/json');
              // simple mock response
              const body = JSON.stringify({ token: 'dev-token-123', user: { email: 'dev@example.com', name: 'Dev User', password: 'dev-password' } });
              res.statusCode = 200;
              res.end(body);
              return;
            }
          } catch {
            // fall through to next
          }
          next();
        });
      }
    }
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    // Proxy /api requests to backend running on localhost:4000 during development
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        // optionally rewrite path if your backend doesn't use /api prefix
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
