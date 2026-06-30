import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// VITE_BASE lets us serve the admin SPA under a path prefix (e.g. /admin/)
// behind the shared nginx gateway. Vite bakes the value into every asset
// URL in index.html and every dynamic import, so the gateway forwards them
// correctly without rewriting.
export default defineConfig({
  base: process.env.VITE_BASE || '/',
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.spec.ts'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
});
