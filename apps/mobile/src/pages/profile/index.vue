<script setup lang="ts">
import { computed } from 'vue';
import { useProfileReviewsQuery } from '../../composables/useProfileReviewsQuery';
import { useMyMatchesQuery } from '../../composables/useMyMatchesQuery';
import { useJoinedMatchesQuery } from '../../composables/useJoinedMatchesQuery';
import { useAuthStore } from '../../stores/auth';
import { formatLevel, formatReviewTag } from '../../utils/copy';

const authStore = useAuthStore();
const activeUserId = computed(() => authStore.user?.id ?? '');
const isAuthenticated = computed(() => Boolean(authStore.token && authStore.user));
const profileQuery = useProfileReviewsQuery(activeUserId);
const myMatchesQuery = useMyMatchesQuery(activeUserId);
const joinedMatchesQuery = useJoinedMatchesQuery(activeUserId);
const profile = computed(() => profileQuery.data.value);
const myMatches = computed(() => myMatchesQuery.data.value?.items ?? []);
const joinedMatches = computed(() => joinedMatchesQuery.data.value?.items ?? []);

function getQueryStatusCode(error: unknown) {
  if (error && typeof error === 'object' && 'statusCode' in error) {
    return Number((error as { statusCode?: number }).statusCode);
  }

  return 0;
}

const joinedMatchesErrorCopy = computed(() => {
  if (!joinedMatchesQuery.isError.value) {
    return '';
  }

  if (getQueryStatusCode(joinedMatchesQuery.error.value) === 401) {
    return '登录状态已过期，请退出后重新登录';
  }

  return '参加的球局加载失败，请稍后再试';
});

const profileMeta = computed(() => {
  const city = profile.value?.user.city ?? '上海';
  const level = formatLevel(profile.value?.user.level ?? 'intermediate');
  const totalReviews = profile.value?.stats.totalReviews ?? 0;

  return `${city} · ${level} · ${totalReviews} 条评价`;
});

const scoreCopy = computed(() => {
  const positiveReviews = profile.value?.stats.positiveReviews ?? 0;
  const totalReviews = profile.value?.stats.totalReviews ?? 0;
  const averageScore = profile.value?.stats.averageScore ?? 0;

  return `最近收到 ${positiveReviews} 条好评，共 ${totalReviews} 条评价，平均 ${averageScore} 分。`;
});

function formatStartTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${month}月${day}日 ${hours}:${minutes}`;
}

function openMatchDetail(id: string) {
  uni.navigateTo({
    url: `/pages/match-detail/index?id=${encodeURIComponent(id)}`,
  });
}

function openLogin() {
  uni.navigateTo({
    url: '/pages/login/index?redirect=%2Fpages%2Fprofile%2Findex',
  });
}

function handleLogout() {
  authStore.clearSession();
  uni.switchTab({
    url: '/pages/home/index',
  });
}
</script>

<template>
  <view class="page">
    <template v-if="!isAuthenticated">
      <view class="hero">
        <text class="eyebrow">我的</text>
        <text class="name">登录后查看你的球局和信用档案</text>
        <text class="meta">发起的球局、参加中的球局和信用记录，都会在这里同步。</text>
        <button class="logout-button" data-testid="profile-login-entry" @click="openLogin">去登录</button>
      </view>
    </template>

    <template v-else>
      <view class="hero">
        <text class="eyebrow">信用档案</text>
        <text class="name">{{ profile?.user.nickname ?? '正在加载资料...' }}</text>
        <text class="meta">{{ profileMeta }}</text>
        <button class="logout-button" data-testid="logout-action" @click="handleLogout">退出登录</button>
      </view>

      <view class="score-card">
        <text class="score-label">信用分</text>
        <text class="score-value">{{ profile?.user.creditScore ?? '--' }}</text>
        <text class="score-copy">{{ scoreCopy }}</text>
      </view>

      <view class="panel">
        <view class="stat-row">
          <text class="stat-label">累计评价</text>
          <text class="stat-value">{{ profile?.stats.totalReviews ?? 0 }}</text>
        </view>
        <view class="stat-row">
          <text class="stat-label">好评数</text>
          <text class="stat-value">{{ profile?.stats.positiveReviews ?? 0 }}</text>
        </view>
        <view class="stat-row">
          <text class="stat-label">最近评价人</text>
          <text class="stat-value">{{ profile?.items[0]?.reviewerName ?? '暂时还没有' }}</text>
        </view>
      </view>

      <view class="tag-row">
        <text v-for="tag in profile?.tags ?? []" :key="tag.tag" class="tag">{{ formatReviewTag(tag.tag) }}</text>
      </view>

      <view v-if="profile?.items?.length" class="panel">
        <view v-for="item in profile.items" :key="item.id" class="stat-row stat-row--stacked">
          <text class="stat-value">{{ item.reviewerName }} · {{ item.score }}/5</text>
          <text class="stat-label">{{ item.tags.map((tag) => formatReviewTag(tag)).join(' / ') }}</text>
        </view>
      </view>

      <view class="panel">
        <text class="section-title">我发起的球局</text>

        <view v-if="myMatches.length === 0" class="stat-row stat-row--stacked">
          <text class="stat-value">你还没有发起过球局</text>
          <text class="stat-label">去首页发起第一场吧</text>
        </view>

        <view
          v-for="item in myMatches"
          :key="item.id"
          class="hosted-card"
          data-testid="hosted-match-card"
          @click="openMatchDetail(item.id)"
        >
          <text class="hosted-title">{{ item.title }}</text>
          <text class="hosted-copy">{{ item.venueName }}</text>
          <text class="hosted-copy">{{ formatStartTime(item.startTime) }} · {{ formatLevel(item.level) }}</text>
          <text class="hosted-meta">还有 {{ item.openSlots }} 个空位 · 匹配度 {{ item.matchRate }}%</text>
        </view>
      </view>

      <view class="panel">
        <text class="section-title">我参加的球局</text>

        <view v-if="joinedMatchesErrorCopy" class="stat-row stat-row--stacked">
          <text class="stat-value">{{ joinedMatchesErrorCopy }}</text>
          <text class="stat-label">为了保护你的数据，需要重新确认登录状态</text>
        </view>

        <view v-else-if="joinedMatches.length === 0" class="stat-row stat-row--stacked">
          <text class="stat-value">你还没有通过审核的球局</text>
          <text class="stat-label">去广场挑一场合适的，申请加入吧</text>
        </view>

        <view
          v-for="item in joinedMatches"
          :key="item.id"
          class="hosted-card joined-card"
          data-testid="joined-match-card"
          @click="openMatchDetail(item.id)"
        >
          <text class="hosted-title">{{ item.title }}</text>
          <text class="hosted-copy">{{ item.venueName }}</text>
          <text class="hosted-copy">{{ formatStartTime(item.startTime) }} · {{ formatLevel(item.level) }}</text>
          <text class="hosted-meta">这场球局已经通过审核，可以继续进聊天沟通</text>
        </view>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #f7efe3 0%, $color-bg 48%, #fffdf9 100%);
}

.hero {
  padding: 32rpx;
  border-radius: 30rpx;
  background: linear-gradient(145deg, #0f1c2e 0%, #25374f 100%);
  box-shadow: $shadow-card;
}

.eyebrow,
.name,
.meta,
.score-label,
.score-value,
.score-copy,
.section-title,
.hosted-title,
.hosted-copy,
.hosted-meta {
  display: block;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.68);
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.name {
  margin-top: 12rpx;
  color: #fff;
  font-size: 48rpx;
  font-weight: 800;
}

.meta {
  margin-top: 12rpx;
  color: rgba(255, 255, 255, 0.82);
  font-size: 24rpx;
  line-height: 1.6;
}

.logout-button {
  margin-top: 20rpx;
  width: 100%;
  min-height: 78rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.score-card {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.14), rgba(255, 253, 249, 0.98));
  box-shadow: $shadow-card;
}

.score-label {
  color: $color-muted;
  font-size: 22rpx;
}

.score-value {
  margin-top: 10rpx;
  color: $color-ink;
  font-size: 56rpx;
  font-weight: 800;
}

.score-copy {
  margin-top: 10rpx;
  color: $color-ink;
  font-size: 24rpx;
  line-height: 1.6;
}

.panel {
  margin-top: 24rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: rgba(255, 253, 249, 0.95);
  box-shadow: $shadow-card;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid rgba(15, 28, 46, 0.08);
}

.stat-row:last-child {
  border-bottom: 0;
}

.stat-row--stacked {
  display: block;
}

.stat-label {
  color: $color-muted;
  font-size: 24rpx;
}

.stat-value {
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 22rpx;
}

.tag {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 700;
}

.section-title {
  color: $color-ink;
  font-size: 30rpx;
  font-weight: 800;
}

.hosted-card {
  margin-top: 20rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #fff8f1;
}

.joined-card {
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.1), rgba(255, 253, 249, 0.96));
}

.hosted-title {
  color: $color-ink;
  font-size: 28rpx;
  font-weight: 800;
}

.hosted-copy {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 24rpx;
}

.hosted-meta {
  margin-top: 10rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
