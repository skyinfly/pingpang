<script setup lang="ts">
/**
 * Global toast renderer. Mounted once from App.vue (via a top-level
 * Suspense-free wrapper) and watches the toast Pinia store. Replaces
 * uni.showToast because uni's H5 polyfill drops messages over 7
 * Chinese chars when an icon is set and was occasionally not rendering
 * under our Vue 3 + Vite + uni runtime combo.
 */
import { useToastStore } from '../stores/toast';

const toastStore = useToastStore();
</script>

<template>
  <view class="toast-layer" data-app-toast>
    <view
      v-for="item in toastStore.items"
      :key="item.id"
      class="toast"
      :class="`toast--${item.tone}`"
      @click="toastStore.dismiss(item.id)"
    >
      <text class="prefix" v-if="item.tone === 'success'">✓</text>
      <text class="prefix" v-else-if="item.tone === 'error'">⚠</text>
      <text class="body">{{ item.text }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.toast-layer {
  position: fixed;
  top: 20%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  pointer-events: none; // overlay never blocks taps under it
  z-index: 9999;
}
/* Soft, friendly bubble. Light backgrounds + darker tone-matched text +
 * a coloured left border for status. Way less aggressive than the
 * earlier solid-dark / solid-red look. */
.toast {
  pointer-events: auto;
  max-width: 80%;
  padding: 20rpx 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
  color: #0f1c2e;
  font-size: 26rpx;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 12rpx 28rpx rgba(15, 28, 46, 0.12);
  border-left: 6rpx solid rgba(15, 28, 46, 0.16);
  animation: toast-in 0.18s ease;
}
.toast--success {
  background: #effaf1;            // mint green
  border-left-color: #2ea65f;
  color: #1f6f3f;
}
.toast--error {
  background: #fff4ec;            // warm peach (matches app's orange brand)
  border-left-color: #ff8a5b;
  color: #c0461d;
}
.prefix {
  font-weight: 800;
  font-size: 30rpx;
}
.body {
  flex: 1;
  word-break: break-all;
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(-8rpx); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
