import { createApp as createClientApp, createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import WebPreviewApp from './web-preview/App.vue';
import { useAuthStore } from './stores/auth';
import { ensureWebPreviewUni } from './web-preview/uni';

/**
 * Reset the page scroll to the top whenever the user taps a tab bar
 * item. uni-app keeps tab pages alive between switches and restores
 * their last scroll offset, which feels stale (you scroll down a list
 * on 广场, hit 消息, hit 广场 again and the page is still scrolled).
 *
 * `uni.addInterceptor('switchTab')` runs reliably for every tab tap on
 * all platforms — much more reliable than listening for `hashchange`,
 * which uni-app's H5 router does sometimes skip when state already
 * matches the next route.
 */
function installTabScrollResetInterceptor() {
  if (typeof uni === 'undefined' || typeof uni.addInterceptor !== 'function') return;
  const scrollToTop = () => {
    if (typeof window === 'undefined' || typeof window.scrollTo !== 'function') return;
    // requestAnimationFrame so the reset happens after uni-app has
    // mounted / displayed the destination page — calling scrollTo
    // synchronously would race against uni's own scroll restoration.
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }));
  };
  uni.addInterceptor('switchTab', {
    success: scrollToTop,
    complete: scrollToTop,
  });
}

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const queryClient = new QueryClient();

  app.use(pinia);
  useAuthStore(pinia).hydrateSession();
  app.use(VueQueryPlugin, { queryClient });
  installTabScrollResetInterceptor();

  return { app, pinia };
}

if (typeof document !== 'undefined') {
  ensureWebPreviewUni();
  const app = createClientApp(WebPreviewApp);
  const pinia = createPinia();
  const queryClient = new QueryClient();

  app.use(pinia);
  useAuthStore(pinia).hydrateSession();
  app.use(VueQueryPlugin, { queryClient });
  installTabScrollResetInterceptor();
  app.mount('#app');
}
