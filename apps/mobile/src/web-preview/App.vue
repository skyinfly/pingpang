<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import appPages from '../pages.json';
import HomePage from '../pages/home/index.vue';
import SquarePage from '../pages/square/index.vue';
import MatchDetailPage from '../pages/match-detail/index.vue';
import MessagesPage from '../pages/messages/index.vue';
import ProfilePage from '../pages/profile/index.vue';
import LoginPage from '../pages/login/index.vue';
import CreateMatchPage from '../pages/create-match/index.vue';
import ChatPage from '../pages/chat/index.vue';
import UserProfilePage from '../pages/user-profile/index.vue';
import EditProfilePage from '../pages/edit-profile/index.vue';
import HistoryMatchesPage from '../pages/history-matches/index.vue';
import LegalPrivacyPage from '../pages/legal/privacy.vue';
import LegalTermsPage from '../pages/legal/terms.vue';
import { getWebPreviewRoute } from './route';

const route = ref(getWebPreviewRoute());

// IMPORTANT: every route declared in pages.json must show up here too —
// the WebPreviewApp falls back to HomePage on an unknown path, which is
// what made `/pages/legal/privacy` and `/pages/legal/terms` silently land
// on the home tab when users tapped the consent links.
const views = {
  '/pages/home/index': HomePage,
  '/pages/square/index': SquarePage,
  '/pages/match-detail/index': MatchDetailPage,
  '/pages/messages/index': MessagesPage,
  '/pages/profile/index': ProfilePage,
  '/pages/login/index': LoginPage,
  '/pages/create-match/index': CreateMatchPage,
  '/pages/chat/index': ChatPage,
  '/pages/user-profile/index': UserProfilePage,
  '/pages/edit-profile/index': EditProfilePage,
  '/pages/history-matches/index': HistoryMatchesPage,
  '/pages/legal/privacy': LegalPrivacyPage,
  '/pages/legal/terms': LegalTermsPage,
};

const currentView = computed(() => views[route.value.path as keyof typeof views] ?? HomePage);

// Dev-only guard: if pages.json declares a route that isn't wired into the
// preview shell's `views` map above, surface it loudly instead of silently
// falling back to Home (which is what made the legal pages misroute).
if (typeof console !== 'undefined') {
  for (const page of appPages.pages) {
    const path = `/${page.path}`;
    if (!(path in views)) {
      console.warn(
        `[web-preview] route ${path} declared in pages.json but missing from App.vue views map; ` +
          'navigateTo will silently land on home.',
      );
    }
  }
}

const pageMeta = new Map(appPages.pages.map((page) => [`/${page.path}`, page.style]));
const tabItems = appPages.tabBar.list.map((item) => ({
  path: `/${item.pagePath}`,
  text: item.text,
}));
const activeTabPath = computed(() => tabItems.find((item) => item.path === route.value.path)?.path ?? '');
const shouldShowTabbar = computed(() => tabItems.some((item) => item.path === route.value.path));
const shouldShowNavbar = computed(() => !shouldShowTabbar.value);
const navbarTitle = computed(() => {
  const style = pageMeta.get(route.value.path);
  return style?.navigationBarTitleText ?? appPages.globalStyle.navigationBarTitleText;
});

function syncRoute() {
  const next = getWebPreviewRoute();
  const pathChanged = next.path !== route.value.path;
  route.value = next;
  // Hash-driven path changes (back/forward, deep-link, programmatic
  // tab switch) all funnel through this — keep scroll reset hooked
  // here so it's not just tied to the manual tab-tap path above.
  if (pathChanged) resetAllScrolls();
}

/**
 * Reset every scroll container we know about. Called when the tab
 * route changes. Fires three times — synchronously, on the next
 * animation frame, and on the next macrotask — because uni-app's
 * H5 polyfill sometimes restores the scroll position itself after
 * the route change, and a single sync call gets clobbered.
 */
function resetAllScrolls() {
  const apply = () => {
    if (typeof globalThis.scrollTo === 'function') {
      globalThis.scrollTo({ top: 0, behavior: 'auto' });
    }
    const containers = globalThis.document?.querySelectorAll?.(
      '.preview-content, uni-scroll-view, [data-tab-scroll]',
    );
    containers?.forEach((el) => {
      if ('scrollTop' in el) (el as HTMLElement).scrollTop = 0;
    });
    if (globalThis.document?.documentElement) {
      globalThis.document.documentElement.scrollTop = 0;
    }
    if (globalThis.document?.body) {
      globalThis.document.body.scrollTop = 0;
    }
  };
  apply();
  if (typeof globalThis.requestAnimationFrame === 'function') {
    globalThis.requestAnimationFrame(apply);
  }
  if (typeof globalThis.setTimeout === 'function') {
    globalThis.setTimeout(apply, 0);
    // Final pass once Vue's flush has run + the new view painted.
    globalThis.setTimeout(apply, 50);
  }
}

function switchTab(path: string) {
  globalThis.location.hash = path;
  resetAllScrolls();
}

function goBack() {
  if (globalThis.history.length > 1) {
    globalThis.history.back();
    return;
  }

  globalThis.location.hash = '/pages/home/index';
}

onMounted(() => {
  if (!globalThis.location.hash) {
    globalThis.location.hash = '/pages/home/index';
  }

  syncRoute();
  globalThis.addEventListener('hashchange', syncRoute);
});

onBeforeUnmount(() => {
  globalThis.removeEventListener('hashchange', syncRoute);
});
</script>

<template>
  <view class="preview-shell" :class="{ 'preview-shell--with-navbar': shouldShowNavbar }">
    <view v-if="shouldShowNavbar" class="preview-navbar">
      <button class="preview-navbar__back" data-testid="preview-back" @click="goBack">返回</button>
      <text class="preview-navbar__title">{{ navbarTitle }}</text>
      <view class="preview-navbar__spacer" />
    </view>

    <view class="preview-content" :class="{ 'preview-content--fit-viewport': shouldShowNavbar }">
      <component :is="currentView" :key="route.fullPath" />
    </view>

    <view v-if="shouldShowTabbar" class="preview-tabbar">
      <button
        v-for="item in tabItems"
        :key="item.path"
        class="preview-tabbar__item"
        :class="{ 'preview-tabbar__item--active': activeTabPath === item.path }"
        @click="switchTab(item.path)"
      >
        <text class="preview-tabbar__label">{{ item.text }}</text>
      </button>
    </view>
  </view>
</template>

<style lang="scss">
:global(html),
:global(body),
:global(#app) {
  min-height: 100%;
}

:global(body) {
  margin: 0;
  background: #fff9f1;
  color: #0f1c2e;
  font-family:
    'Segoe UI',
    'PingFang SC',
    'Hiragino Sans GB',
    'Microsoft YaHei',
    sans-serif;
}

.preview-shell {
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background: #fff9f1;
  --preview-navbar-height: 0px;
  --preview-bottom-offset: 88px;
}

.preview-shell--with-navbar {
  --preview-navbar-height: 56px;
  --preview-bottom-offset: 0px;
}

.preview-content {
  height: calc(100vh - var(--preview-navbar-height));
  min-height: calc(100vh - var(--preview-navbar-height));
  overflow: auto;
  padding-bottom: var(--preview-bottom-offset);
}

.preview-content--fit-viewport {
  overscroll-behavior: contain;
}

.preview-navbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: 88px minmax(0, 1fr) 88px;
  align-items: center;
  min-height: 56px;
  padding: 8px 16px;
  background: rgba(255, 249, 241, 0.94);
  border-bottom: 1px solid rgba(15, 28, 46, 0.08);
  backdrop-filter: blur(14px);
}

.preview-navbar__back,
.preview-navbar__spacer {
  min-width: 0;
}

.preview-navbar__back {
  justify-self: start;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: rgba(255, 106, 61, 0.1);
  color: #ff6a3d;
  font-size: 14px;
  font-weight: 700;
}

.preview-navbar__title {
  justify-self: center;
  font-size: 16px;
  font-weight: 800;
  color: #0f1c2e;
}

.preview-tabbar {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 10px 12px calc(10px + env(safe-area-inset-bottom, 0));
  background: rgba(255, 249, 241, 0.94);
  border-top: 1px solid rgba(15, 28, 46, 0.08);
  backdrop-filter: blur(14px);
  box-shadow: 0 -8px 24px rgba(15, 28, 46, 0.06);
}

.preview-tabbar__item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  border-radius: 999px;
  color: #6d7888;
  transition:
    background-color 120ms ease,
    color 120ms ease,
    transform 120ms ease;
}

.preview-tabbar__item:active {
  transform: translateY(1px);
}

.preview-tabbar__item--active {
  background: rgba(255, 106, 61, 0.12);
  color: #ff6a3d;
}

.preview-tabbar__label {
  font-size: 14px;
  font-weight: 700;
}

:global(*),
:global(*::before),
:global(*::after) {
  box-sizing: border-box;
}

:global(view),
:global(scroll-view),
:global(swiper),
:global(swiper-item) {
  display: block;
}

:global(text) {
  display: inline-block;
}

:global(button) {
  appearance: none;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
}

:global(input) {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
}
</style>
