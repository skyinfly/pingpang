import { defineConfig } from 'vite';
import uniModule from '@dcloudio/vite-plugin-uni';

type UniFactory = typeof import('@dcloudio/vite-plugin-uni').default;

const uni = (
  typeof uniModule === 'function'
    ? uniModule
    : (uniModule as unknown as { default: UniFactory }).default
) as UniFactory;

// 把 uniapp 的 rpx 单位转为 px（H5 浏览器预览专用）
// 按 750rpx 设计稿对应 375px viewport：1rpx = 0.5px
function rpxToPx() {
  return {
    postcssPlugin: 'rpx-to-px',
    Declaration(decl: { value: string }) {
      if (typeof decl.value !== 'string' || !decl.value.includes('rpx')) return;
      decl.value = decl.value.replace(/(-?\d*\.?\d+)rpx/g, (_, n) => {
        const px = Number(n) * 0.5;
        return `${px}px`;
      });
    },
  };
}
rpxToPx.postcss = true;

export default defineConfig({
  plugins: [uni()],
  css: {
    postcss: {
      plugins: [rpxToPx()],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/__tests__/**/*.spec.ts'],
  },
});
