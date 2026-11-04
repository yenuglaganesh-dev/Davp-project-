import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { authMiddleware } from './src/server/authApi.js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'institutional-auth-rbac-middleware',
      configureServer(server) {
        server.middlewares.use(authMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(authMiddleware);
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
});
