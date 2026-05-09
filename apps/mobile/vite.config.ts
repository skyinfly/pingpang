import { defineConfig } from 'vite';
import uniModule from '@dcloudio/vite-plugin-uni';

type UniFactory = typeof import('@dcloudio/vite-plugin-uni').default;

const uni = (
  typeof uniModule === 'function'
    ? uniModule
    : (uniModule as unknown as { default: UniFactory }).default
) as UniFactory;

export default defineConfig({
  plugins: [uni()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.spec.ts'],
  },
});
