import { defineConfig } from 'vite';
import uniModule from '@dcloudio/vite-plugin-uni';

type UniFactory = typeof import('@dcloudio/vite-plugin-uni').default;

const uni = (
  typeof uniModule === 'function'
    ? uniModule
    : (uniModule as unknown as { default: UniFactory }).default
) as UniFactory;

/**
 * uni-app's H5 build emits raw `rpx` units. Browsers ignore the unknown
 * unit, so without runtime patching every margin/padding/font-size silently
 * drops to 0 and the page looks unstyled. Convert rpx -> vw at build time
 * using uni-app's 750-rpx design width: 1rpx == 100vw / 750.
 *
 * Shape note: PostCSS plugins are registered as `() => pluginObject` with
 * a `postcss = true` marker on the factory. Returning a plain object (as
 * earlier revisions did) confused PostCSS's normalizer when Vite tried to
 * pass scoped Vue SFC styles through the pipeline during vitest runs.
 */
type DeclarationNode = { value: string };
const rpxRegex = /(-?\d+(?:\.\d+)?)rpx/g;
const rpxToVw = (): {
  postcssPlugin: string;
  Declaration: (decl: DeclarationNode) => void;
} => ({
  postcssPlugin: 'pingpang-rpx-to-vw',
  Declaration(decl) {
    if (!decl.value || decl.value.indexOf('rpx') === -1) return;
    decl.value = decl.value.replace(
      rpxRegex,
      (_match, raw) => `${(parseFloat(raw) / 7.5).toFixed(4)}vw`,
    );
  },
});
(rpxToVw as unknown as { postcss: boolean }).postcss = true;

export default defineConfig({
  plugins: [uni()],
  css: {
    postcss: {
      plugins: [rpxToVw() as never],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.spec.ts'],
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
