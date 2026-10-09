import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In production (GitHub Pages) the app lives under /RIDE-SYNC/.
// In development the Vite dev-server proxy to localhost:5000 is used instead.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/RIDE-SYNC/' : '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
