<script setup lang="ts">
import { computed } from 'vue';
import { useMatchesQuery } from '../../composables/useMatchesQuery';
import { formatLevel } from '../../utils/copy';

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

const matchesQuery = useMatchesQuery({ city: '上海', level: 'intermediate' });
const featuredMatch = computed(() => matchesQuery.data.value?.items[0] ?? null);
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

      <view v-else-if="featuredMatch" class="card" @click="openMatchDetail(featuredMatch.id)">
        <text class="card-title">{{ featuredMatch.title }}</text>
        <text class="card-meta">
          {{ featuredMatch.distanceKm }}km · 还差 {{ featuredMatch.openSlots }} 人 · 匹配度 {{ featuredMatch.matchRate }}%
        </text>
        <text class="card-caption">
          {{ featuredMatch.venueName }} · {{ formatMatchTime(featuredMatch.startTime) }} · 主理人信用 {{ featuredMatch.hostCreditScore }}
        </text>
      </view>

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
  padding: 28rpx;
  background: $color-surface;
  box-shadow: $shadow-card;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $color-ink;
}

.card-meta {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.card-caption {
  display: block;
  margin-top: 16rpx;
  font-size: 22rpx;
  color: $color-primary;
}
</style>
