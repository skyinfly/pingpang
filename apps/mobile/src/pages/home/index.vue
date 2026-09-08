<script setup lang="ts">
import { computed } from 'vue';
import { useMatchesQuery } from '../../composables/useMatchesQuery';
import { formatLevel } from '../../utils/copy';
import LocationHeader from '../../components/LocationHeader.vue';

function formatMatchTime(value?: string) {
  if (!value) {
    return '今晚待定';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `今晚 ${hours}:${minutes} 开局`;
}

// Home preview shows ALL open matches regardless of city/level so a new
// user always sees activity. The square page is where filters live.
const matchesQuery = useMatchesQuery({});
const featuredMatch = computed(() => matchesQuery.data.value?.items[0] ?? null);
const recommendedMatches = computed(() => (matchesQuery.data.value?.items ?? []).slice(0, 5));
const heroEyebrow = computed(() => (featuredMatch.value ? '今晚推荐' : '今晚好局'));
const heroTitle = computed(() => featuredMatch.value?.title ?? '今晚 20:00 前快速成局');
const heroSubtitle = computed(() => {
  if (!featuredMatch.value) {
    return '同区匹配优先，系统按规则推荐。';
  }

  return `${featuredMatch.value.venueName} · ${formatMatchTime(featuredMatch.value.startTime)} · ${formatLevel(featuredMatch.value.level)}`;
});

function openSquare() {
  uni.switchTab({
    url: '/pages/square/index',
  });
}

function openCreateMatch() {
  uni.navigateTo({
    url: '/pages/create-match/index',
  });
}

function openMatchDetail(id: string) {
  uni.navigateTo({
    url: `/pages/match-detail/index?id=${encodeURIComponent(id)}`,
  });
}
</script>

<template>
  <view class="page">
    <LocationHeader />
    <view class="hero">
      <text class="eyebrow">{{ heroEyebrow }}</text>
      <text class="title">{{ heroTitle }}</text>
      <text class="subtitle">{{ heroSubtitle }}</text>

      <view class="hero-actions">
        <button class="hero-button hero-button--primary" data-testid="create-match-entry" @click="openCreateMatch">
          发起约球
        </button>
        <button class="hero-button hero-button--secondary" @click="openSquare">去广场看看</button>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">为你推荐</text>
        <text class="section-link" @click="openSquare">查看全部</text>
      </view>

      <view v-if="matchesQuery.isLoading.value" class="card">
        <text class="card-title">正在为你刷新推荐</text>
        <text class="card-meta">附近中级场次正在按匹配度排序...</text>
      </view>

      <template v-else-if="recommendedMatches.length">
        <view
          v-for="item in recommendedMatches"
          :key="item.id"
          class="card"
          data-testid="home-match-card"
          @click="openMatchDetail(item.id)"
        >
          <image v-if="item.coverUrl" :src="item.coverUrl" class="card-cover" mode="aspectFill" />
          <view class="card-header-row">
            <text class="card-title">{{ item.title }}</text>
            <view class="card-badge" :class="{ 'card-badge--hot': item.openSlots <= 2 }">
              <text class="card-badge-dot">●</text>
              <text class="card-badge-text">剩 {{ item.openSlots }} 席</text>
            </view>
          </view>
          <text class="card-meta">
            {{ item.distanceKm }}km · 匹配度 {{ item.matchRate }}%
          </text>
          <text class="card-caption">
            {{ item.venueName }} · {{ formatMatchTime(item.startTime) }} · 🛡️ 信用 {{ item.hostCreditScore }}
          </text>
        </view>
      </template>

      <view v-else class="card">
        <text class="card-title">今晚暂时没有合适球局</text>
        <text class="card-meta">换个时段，或者去广场看看更多真实球局。</text>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff3e6 0%, $color-bg 45%, #fffdf9 100%);
  padding: 32rpx;
}

.hero {
  border-radius: $radius-card;
  padding: 32rpx;
  background: linear-gradient(135deg, #ff6a3d 0%, #ff8f57 100%);
  box-shadow: $shadow-card;
  color: #fff;
}

.eyebrow {
  display: block;
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  opacity: 0.92;
}

.title {
  display: block;
  margin-top: 12rpx;
  font-size: 52rpx;
  font-weight: 800;
  line-height: 1.18;
}

.subtitle {
  display: block;
  margin-top: 16rpx;
  font-size: 24rpx;
  line-height: 1.5;
  opacity: 0.96;
}

.hero-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 24rpx;
}

.hero-button {
  margin: 0;
  border-radius: 999rpx;
  padding: 0 28rpx;
  min-height: 84rpx;
  font-size: 26rpx;
  font-weight: 800;
}

.hero-button--primary {
  background: #0f1c2e;
  color: #fff;
}

.hero-button--secondary {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.32);
}

.section {
  margin-top: 32rpx;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: 700;
  color: $color-ink;
}

.section-link {
  font-size: 24rpx;
  font-weight: 600;
  color: $color-primary;
}

.card {
  border-radius: $radius-card;
  overflow: hidden;
  background: $color-surface;
  box-shadow: 0 10rpx 30rpx rgba(15, 28, 46, 0.05);
  border: 1px solid rgba(15, 28, 46, 0.05);
  margin-bottom: 24rpx;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:active {
    transform: scale(0.985);
  }
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 28rpx 0;
  gap: 16rpx;
}

.card-badge {
  display: inline-flex;
  align-items: center;
  gap: 6rpx;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(47, 191, 113, 0.12);
  color: #1f9d55;
  font-size: 20rpx;
  font-weight: 700;
  flex-shrink: 0;

  &--hot {
    background: rgba(255, 106, 61, 0.12);
    color: #e04f26;
  }
}

.card-badge-dot {
  font-size: 14rpx;
}

.card-cover {
  display: block;
  width: 100%;
  height: 240rpx;
}

.card-title {
  padding: 0 !important;
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: $color-ink;
  flex: 1;
}

.card-meta {
  display: block;
  margin-top: 12rpx;
  padding: 0 28rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.card-caption {
  display: block;
  margin-top: 16rpx;
  padding: 0 28rpx 28rpx;
  font-size: 22rpx;
  color: $color-primary;
}
</style>
