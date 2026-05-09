import { createApp as createClientApp, createSSRApp } from 'vue';
import { createPinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import WebPreviewApp from './web-preview/App.vue';
import { useAuthStore } from './stores/auth';
import { ensureWebPreviewUni } from './web-preview/uni';

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();
  const queryClient = new QueryClient();

  app.use(pinia);
  useAuthStore(pinia).hydrateSession();
  app.use(VueQueryPlugin, { queryClient });

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
  app.mount('#app');
}
