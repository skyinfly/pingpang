<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { fetchPublicProfile, fetchReviewProfile, reportUser } from '../../services/api';
import type { PublicUserProfile, ReviewProfile } from '../../services/types';
import { useAuthStore } from '../../stores/auth';
import { formatLevel } from '../../utils/copy';

const authStore = useAuthStore();
const profile = ref<PublicUserProfile | null>(null);
const reviewSummary = ref<ReviewProfile | null>(null);
const loading = ref(true);
const errorMessage = ref('');
const reportOpen = ref(false);
const reportReason = ref('');
const reportSubmitting = ref(false);
const reportError = ref('');
const reportDone = ref(false);

const canReport = computed(() => {
  return Boolean(authStore.token && profile.value && authStore.user?.id !== profile.value.id);
});

function openReport() {
  if (!authStore.token) {
    uni.navigateTo({
      url: `/pages/login/index?redirect=${encodeURIComponent(`/pages/user-profile/index?id=${profile.value?.id ?? ''}`)}`,
    });
    return;
  }
  reportOpen.value = true;
  reportReason.value = '';
  reportError.value = '';
  reportDone.value = false;
}

function closeReport() {
  reportOpen.value = false;
}

async function submitReport() {
  if (!profile.value || reportSubmitting.value) {
    return;
  }

  const trimmed = reportReason.value.trim();
  if (trimmed.length < 1) {
    reportError.value = '请简单写一下举报原因，方便我们处理。';
    return;
  }

  reportSubmitting.value = true;
  reportError.value = '';

  try {
    await reportUser({
      targetUserId: profile.value.id,
      reason: trimmed,
    });
    reportDone.value = true;
  } catch {
    reportError.value = '举报提交失败，请稍后再试。';
  } finally {
    reportSubmitting.value = false;
  }
}

function getUserIdFromLocation() {
  if (typeof window === 'undefined') {
    return '';
  }

  const hash = window.location.hash || '';
  const queryIndex = hash.indexOf('?');

  if (queryIndex === -1) {
    return '';
  }

  const searchParams = new URLSearchParams(hash.slice(queryIndex + 1));
  return searchParams.get('id') ?? '';
}

async function load() {
  const userId = getUserIdFromLocation();

  if (!userId) {
    errorMessage.value = '缺少用户标识，无法加载档案。';
    loading.value = false;
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const [publicProfile, reviews] = await Promise.all([
      fetchPublicProfile(userId),
      fetchReviewProfile(userId).catch(() => null),
    ]);
    profile.value = publicProfile;
    reviewSummary.value = reviews;
  } catch {
    errorMessage.value = '档案加载失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

onMounted(() => {
  void load();
});
</script>

<template>
  <view class="page">
    <view v-if="loading" class="card">
      <text class="card-title">正在加载档案</text>
      <text class="card-copy">正在同步这位球友的公开信息...</text>
    </view>

    <view v-else-if="errorMessage" class="card">
      <text class="card-title">{{ errorMessage }}</text>
    </view>

    <template v-else-if="profile">
      <view class="hero">
        <text class="eyebrow">球友档案</text>
        <text class="title">{{ profile.nickname }}</text>
        <text class="hero-meta">{{ profile.city }} · {{ formatLevel(profile.level) }} · 信用 {{ profile.creditScore }}</text>
        <view class="hero-stats">
          <view class="hero-stat">
            <text class="stat-value">{{ profile.hostedMatches }}</text>
            <text class="stat-label">发起球局</text>
          </view>
          <view class="hero-stat">
            <text class="stat-value">{{ profile.joinedMatches }}</text>
            <text class="stat-label">参加球局</text>
          </view>
          <view class="hero-stat">
            <text class="stat-value">{{ reviewSummary?.stats.totalReviews ?? 0 }}</text>
            <text class="stat-label">收到评价</text>
          </view>
        </view>
        <text class="hero-since">加入时间：{{ formatDate(profile.createdAt) }}</text>
        <button
          v-if="canReport"
          class="report-button"
          data-testid="open-report"
          @click="openReport"
        >
          举报该球友
        </button>
      </view>

      <view class="card">
        <text class="card-title">评价标签</text>
        <view v-if="!reviewSummary?.tags.length" class="card-empty">
          <text>还没有人给 TA 打过标签。</text>
        </view>
        <view class="tag-row">
          <text v-for="tag in reviewSummary?.tags" :key="tag.tag" class="tag-chip">
            {{ tag.tag }} ×{{ tag.count }}
          </text>
        </view>
      </view>

      <view class="card">
        <text class="card-title">近期评价</text>
        <view v-if="!reviewSummary?.items.length" class="card-empty">
          <text>暂时还没有公开的评价记录。</text>
        </view>
        <view
          v-for="item in (reviewSummary?.items ?? []).slice(0, 5)"
          :key="item.id"
          class="review-card"
        >
          <text class="review-score">{{ item.score }} 分</text>
          <text class="review-meta">{{ item.reviewerName }} · {{ formatDate(item.createdAt) }}</text>
          <text v-if="item.tags.length" class="review-tags">{{ item.tags.join('、') }}</text>
        </view>
      </view>
    </template>

    <view v-if="reportOpen" class="modal-mask">
      <view class="modal-card">
        <text class="modal-title">举报 {{ profile?.nickname }}</text>
        <text v-if="!reportDone" class="modal-copy">告诉我们发生了什么，运营会在 24 小时内处理。</text>
        <text v-else class="modal-copy">已收到你的举报，感谢反馈。</text>

        <textarea
          v-if="!reportDone"
          v-model="reportReason"
          class="modal-textarea"
          maxlength="280"
          data-testid="report-reason"
          placeholder="例如：到场后并未约球、骚扰球友等"
        />

        <text v-if="reportError" class="error-copy">{{ reportError }}</text>

        <view class="modal-actions">
          <button class="modal-btn modal-btn--ghost" @click="closeReport">
            {{ reportDone ? '关闭' : '取消' }}
          </button>
          <button
            v-if="!reportDone"
            class="modal-btn"
            data-testid="report-submit"
            :disabled="reportSubmitting"
            @click="submitReport"
          >
            {{ reportSubmitting ? '提交中...' : '提交举报' }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #fff3e6 0%, $color-bg 45%, #fffdf9 100%);
}

.hero {
  border-radius: $radius-card;
  padding: 36rpx 32rpx;
  background: linear-gradient(135deg, #ff6a3d 0%, #ff8f57 100%);
  box-shadow: $shadow-card;
  color: #fff;
}

.eyebrow {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  opacity: 0.92;
}

.title {
  display: block;
  margin-top: 10rpx;
  font-size: 48rpx;
  font-weight: 800;
}

.hero-meta {
  display: block;
  margin-top: 16rpx;
  font-size: 26rpx;
}

.hero-stats {
  display: flex;
  gap: 24rpx;
  margin-top: 24rpx;
}

.hero-stat {
  flex: 1;
  padding: 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.18);
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 38rpx;
  font-weight: 800;
}

.stat-label {
  display: block;
  font-size: 22rpx;
  margin-top: 6rpx;
}

.hero-since {
  display: block;
  margin-top: 18rpx;
  font-size: 22rpx;
  opacity: 0.86;
}

.card {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: $radius-card;
  background: $color-surface;
  box-shadow: $shadow-card;
}

.card-title {
  font-size: 30rpx;
  font-weight: 800;
  color: $color-ink;
}

.card-copy,
.card-empty {
  margin-top: 14rpx;
  color: $color-muted;
  font-size: 24rpx;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 14rpx;
}

.tag-chip {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 106, 61, 0.12);
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.review-card {
  margin-top: 14rpx;
  padding: 18rpx;
  border-radius: 20rpx;
  background: #fff7ef;
}

.review-score {
  display: block;
  font-size: 28rpx;
  font-weight: 800;
  color: $color-ink;
}

.review-meta {
  display: block;
  margin-top: 6rpx;
  color: $color-muted;
  font-size: 22rpx;
}

.review-tags {
  display: block;
  margin-top: 6rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.report-button {
  margin-top: 20rpx;
  align-self: flex-start;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.24);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.modal-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  background: rgba(15, 28, 46, 0.45);
  z-index: 50;
}

.modal-card {
  width: 100%;
  max-width: 600rpx;
  padding: 32rpx;
  border-radius: 28rpx;
  background: #fff;
  box-shadow: $shadow-card;
}

.modal-title {
  font-size: 32rpx;
  font-weight: 800;
  color: $color-ink;
}

.modal-copy {
  display: block;
  margin-top: 12rpx;
  color: $color-muted;
  font-size: 24rpx;
}

.modal-textarea {
  width: 100%;
  min-height: 180rpx;
  margin-top: 18rpx;
  padding: 16rpx;
  border-radius: 18rpx;
  background: #fff7ef;
  font-size: 26rpx;
  color: $color-ink;
}

.modal-actions {
  display: flex;
  gap: 14rpx;
  margin-top: 18rpx;
}

.modal-btn {
  flex: 1;
  min-height: 72rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
  font-size: 26rpx;
  font-weight: 800;
}

.modal-btn[disabled] {
  opacity: 0.6;
}

.modal-btn--ghost {
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
}

.error-copy {
  display: block;
  margin-top: 12rpx;
  color: #d44a4a;
  font-size: 22rpx;
}
</style>
