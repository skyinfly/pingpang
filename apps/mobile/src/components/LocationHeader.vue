<script setup lang="ts">
/**
 * Sticky page header showing the user's currently-resolved city.
 *
 * Layout:
 *   ┌────────────────────────────────────────────────────┐
 *   │ 📍  上海市 · 徐汇区                          刷新  │
 *   └────────────────────────────────────────────────────┘
 *
 * Tapping the city pill opens a tooltip with the full street-level
 * address (when AMap reverse geocode resolved one). The tooltip
 * dismisses on a second tap or any click outside; this matches the
 * iOS/Android "pill → detail popover" idiom the user asked for.
 *
 * The refresh button on the right is its own touch target so users
 * can re-fetch without accidentally triggering the tip.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useLocationStore } from '../stores/location';
import { nearestCity } from '../utils/geo';

const locationStore = useLocationStore();
const tipOpen = ref(false);

onMounted(() => {
  // Warm the store. ensure() dedupes inside the store so visiting
  // multiple tabs doesn't re-trigger the geolocation prompt.
  void locationStore.ensure();

  // Click-outside handler. We attach to window because uni-app's view
  // events don't bubble to a parent overlay reliably in H5.
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleOutsideClick, true);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('click', handleOutsideClick, true);
  }
});

const cityLabel = computed(() => {
  if (locationStore.city && locationStore.district) {
    return `${locationStore.city} · ${locationStore.district}`;
  }
  if (locationStore.city) return locationStore.city;
  if (locationStore.coords) {
    return nearestCity(locationStore.coords) ?? '未识别';
  }
  return null;
});

/**
 * Detail line shown under the city · district headline. We only surface
 * it when AMap actually gave us a street-level address (otherwise the
 * detail row would just repeat the city name).
 */
const detailLine = computed(() => {
  if (!locationStore.address) return null;
  if (locationStore.address === locationStore.city) return null;
  return locationStore.address;
});

const statusLabel = computed(() => {
  switch (locationStore.status) {
    case 'requesting':
      return '定位中…';
    case 'denied':
      return '未授权位置';
    case 'unavailable':
      return '定位不可用';
    case 'ready':
      return cityLabel.value ?? '未识别';
    default:
      return '点击启用定位';
  }
});

const toneClass = computed(() => {
  if (locationStore.status === 'ready' && cityLabel.value) return 'header--ready';
  if (locationStore.status === 'requesting') return 'header--loading';
  return 'header--idle';
});

const tipAddress = computed(() => {
  // Prefer the full AMap address; fall back to the IP-derived city when
  // we don't have street info.
  if (locationStore.address) return locationStore.address;
  if (locationStore.city) return locationStore.city;
  return '暂未获取到详细地址';
});

const canOpenTip = computed(() =>
  locationStore.status === 'ready' && Boolean(locationStore.city || locationStore.address),
);

function refresh(event?: Event) {
  // Stop propagation so the click-outside handler doesn't immediately
  // close a tooltip the user just opened in the same gesture.
  event?.stopPropagation?.();
  tipOpen.value = false;
  void locationStore.refresh();
}

function toggleTip(event: Event) {
  event.stopPropagation();
  if (!canOpenTip.value) return;
  tipOpen.value = !tipOpen.value;
}

function handleOutsideClick(event: Event) {
  if (!tipOpen.value) return;
  const target = event.target as HTMLElement | null;
  if (!target) return;
  // Anything inside the header (label area or the tip itself) keeps it open;
  // anything outside dismisses.
  if (!target.closest?.('[data-location-header]')) {
    tipOpen.value = false;
  }
}
</script>

<template>
  <!--
    Wrapper is a passive spacer that takes up the same vertical room
    as the fixed pill below. Without it the pill (which is taken out of
    flow) would overlap the first item of the page. Keeping the spacer
    means existing pages don't have to add a magic top padding.
  -->
  <view class="header-spacer" />
  <view class="header-fixed" data-location-header>
    <view class="header" :class="toneClass">
      <view class="label-tap" @click="toggleTip">
        <text class="pin">📍</text>
        <view class="label-stack">
          <text class="label">{{ statusLabel }}</text>
          <text v-if="detailLine" class="detail">{{ detailLine }}</text>
        </view>
      </view>
      <text class="refresh" @click="refresh">{{ cityLabel ? '刷新' : '重试' }}</text>
    </view>

    <view v-if="tipOpen" class="tip" @click.stop>
      <text class="tip-title">详细地址</text>
      <text class="tip-body">{{ tipAddress }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

/*
 * Two-element layout:
 *   .header-spacer  — invisible inline block sitting in the document
 *                     flow that reserves vertical room equal to the
 *                     fixed pill below. Lets every page keep its
 *                     existing top padding without a magic offset.
 *   .header-fixed   — actual pill, position: fixed at the top of the
 *                     viewport so it does NOT scroll with the rest
 *                     of the page. Pages still scroll normally below.
 *
 * Heights chosen so the spacer = pill height (76rpx) + the bottom
 * margin we used to add via margin-bottom: 16rpx. Tweak together if
 * pill padding changes.
 */
// Spacer height = bar-top-pad (16) + pill height (~76) + bar-bottom-pad
// (16) + breathing room (8). Keep in sync with .header-fixed padding +
// .header padding if any of those shift.
$bar-height: 116rpx;

.header-spacer {
  width: 100%;
  height: $bar-height;
}
.header-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  padding: 16rpx 32rpx;
  // Solid page-tone background so scrolling content disappears the
  // moment it slides under the bar, instead of bleeding through the
  // gaps around the white pill.
  background: $color-bg;
  box-shadow: 0 6rpx 16rpx rgba(15, 28, 46, 0.04);
}
.header {
  display: flex;
  align-items: center;
  padding: 14rpx 18rpx 14rpx 24rpx;
  border-radius: 999rpx;
  background: #ffffff;
  box-shadow: 0 4rpx 14rpx rgba(15, 28, 46, 0.06);
  -webkit-tap-highlight-color: transparent;
}
.label-tap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10rpx;
  cursor: pointer;
  min-width: 0; // let the label ellipsize inside flex
}
.pin {
  font-size: 26rpx;
  flex-shrink: 0;
}
.label-stack {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  min-width: 0;
  flex: 1;
}
.label {
  font-size: 24rpx;
  color: $color-ink;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.detail {
  font-size: 20rpx;
  color: $color-muted;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.refresh {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 700;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: rgba(255, 106, 61, 0.1);
  cursor: pointer;
  margin-left: 12rpx;
  flex-shrink: 0;
}
/* Tone the text only — no per-state background fills, so the pill
 * remains visually transparent over the page. */
.header--ready .label {
  color: $color-primary;
}
.header--loading .label,
.header--idle .label {
  color: $color-muted;
}

/* ---- tooltip popover ---- */
.tip {
  position: absolute;
  top: calc(100% + 6rpx);
  left: 16rpx;
  right: 16rpx;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 32rpx rgba(15, 28, 46, 0.12);
  z-index: 30;
  animation: tip-pop 0.15s ease;
}
.tip::before {
  // Small triangle pointing back at the pill.
  content: '';
  position: absolute;
  top: -10rpx;
  left: 40rpx;
  width: 0;
  height: 0;
  border-left: 10rpx solid transparent;
  border-right: 10rpx solid transparent;
  border-bottom: 10rpx solid #ffffff;
}
.tip-title {
  display: block;
  font-size: 20rpx;
  color: $color-muted;
  margin-bottom: 6rpx;
}
.tip-body {
  display: block;
  font-size: 26rpx;
  color: $color-ink;
  line-height: 1.5;
  word-break: break-all;
}
@keyframes tip-pop {
  from { opacity: 0; transform: translateY(-4rpx); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
