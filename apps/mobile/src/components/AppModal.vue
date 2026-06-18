<script setup lang="ts">
/**
 * Hand-rolled modal that bypasses uni.showModal in H5 — that one
 * delegates to window.confirm and shows the site domain at the top of
 * the dialog which looks unprofessional. We render our own backdrop +
 * card with the same Promise contract.
 *
 * Mounted once per page (alongside AppToast). The component watches the
 * modal store and renders only the queue head, so two simultaneous
 * confirmations stack instead of clobbering each other.
 */
import { computed } from 'vue';
import { useModalStore } from '../stores/modal';

const modalStore = useModalStore();

const current = computed(() => modalStore.current);

function onConfirm() {
  if (current.value) modalStore.settle(current.value.id, true);
}
function onCancel() {
  if (current.value) modalStore.settle(current.value.id, false);
}
</script>

<template>
  <view v-if="current" class="modal-backdrop" data-app-modal>
    <view class="modal-card">
      <text class="modal-title">{{ current.title ?? '提示' }}</text>
      <text class="modal-content">{{ current.content }}</text>
      <view class="modal-actions">
        <view
          v-if="current.showCancel !== false"
          class="modal-button modal-button--secondary"
          data-testid="modal-cancel"
          @click="onCancel"
        >{{ current.cancelText ?? '取消' }}</view>
        <view class="modal-button modal-button--primary" data-testid="modal-confirm" @click="onConfirm">
          {{ current.confirmText ?? '确定' }}
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(15, 28, 46, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  animation: backdrop-in 0.15s ease;
}
.modal-card {
  width: 100%;
  max-width: 560rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 24rpx 60rpx rgba(15, 28, 46, 0.24);
  padding: 36rpx 32rpx 24rpx;
  display: flex;
  flex-direction: column;
  animation: card-in 0.18s ease;
}
.modal-title {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: $color-ink;
  margin-bottom: 16rpx;
}
.modal-content {
  display: block;
  font-size: 26rpx;
  line-height: 1.6;
  color: $color-muted;
  white-space: pre-line;
  margin-bottom: 28rpx;
}
.modal-actions {
  display: flex;
  gap: 16rpx;
}
.modal-button {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 700;
  cursor: pointer;
}
.modal-button--secondary {
  background: rgba(15, 28, 46, 0.06);
  color: $color-ink;
}
.modal-button--primary {
  background: $color-primary;
  color: #ffffff;
  box-shadow: 0 6rpx 16rpx rgba(255, 106, 61, 0.28);
}
@keyframes backdrop-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes card-in {
  from { opacity: 0; transform: translateY(8rpx) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
