<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMessagesQuery } from '../../composables/useMessagesQuery';
import { useAuthStore } from '../../stores/auth';
import { formatThreadStatus } from '../../utils/copy';

const authStore = useAuthStore();
const activeUserId = computed(() => authStore.user?.id ?? '');
const isAuthenticated = computed(() => Boolean(authStore.token && authStore.user));
const messagesQuery = useMessagesQuery(() => activeUserId.value);
const activeFilter = ref<'all' | 'system' | 'chat' | 'invite'>('all');
const summary = computed(
  () =>
    messagesQuery.data.value?.summary ?? {
      unreadSystemCount: 0,
      unreadChatCount: 0,
      pendingInvitesCount: 0,
    },
);
const filteredMessages = computed(() => {
  const items = messagesQuery.data.value?.items ?? [];

  if (activeFilter.value === 'all') {
    return items;
  }

  if (activeFilter.value === 'chat') {
    return [];
  }

  return items.filter((item) => item.kind === activeFilter.value);
});
const threadItems = computed(() => {
  const threads = messagesQuery.data.value?.threads ?? [];

  if (activeFilter.value === 'all' || activeFilter.value === 'chat') {
    return threads;
  }

  return [];
});

function openLogin() {
  uni.navigateTo({
    url: '/pages/login/index?redirect=%2Fpages%2Fmessages%2Findex',
  });
}

function openChatThread(threadId: string) {
  uni.navigateTo({
    url: `/pages/chat/index?threadId=${encodeURIComponent(threadId)}`,
  });
}

function openMessageTarget(matchId?: string | null) {
  if (!matchId) {
    return;
  }

  uni.navigateTo({
    url: `/pages/match-detail/index?id=${encodeURIComponent(matchId)}`,
  });
}

function openSquare() {
  uni.navigateTo({
    url: '/pages/square/index',
  });
}

function formatThreadMeta(status?: string | null, unreadCount = 0, participantCount = 0) {
  return `${formatThreadStatus(status)} · ${unreadCount} 条未读 · ${participantCount} 位球友`;
}

function getMessageStatusLabel(status?: string | null) {
  if (status === 'approved') {
    return '已通过';
  }

  if (status === 'rejected') {
    return '暂未通过';
  }

  if (status === 'pending') {
    return '待处理';
  }

  return '';
}
</script>

<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">消息中心</text>
      <text class="title">消息中心</text>
      <text class="subtitle">申请通过、补位邀请和开局提醒，都会在这里出现。</text>
    </view>

    <view v-if="!isAuthenticated" class="notice-list">
      <view class="notice-card notice-card--accent">
        <text class="notice-title">登录后查看消息和待处理申请</text>
        <text class="notice-copy">主理人审核结果、补位邀请和局内聊天提醒，都会统一收在这里。</text>
        <button class="login-button" data-testid="messages-login-entry" @click="openLogin">去登录</button>
      </view>
    </view>

    <view v-else class="panel">
      <view class="filter-row">
        <button data-filter="all" class="filter-chip" :class="{ 'filter-chip--active': activeFilter === 'all' }" @click="activeFilter = 'all'">全部</button>
        <button data-filter="system" class="filter-chip" :class="{ 'filter-chip--active': activeFilter === 'system' }" @click="activeFilter = 'system'">系统</button>
        <button data-filter="chat" class="filter-chip" :class="{ 'filter-chip--active': activeFilter === 'chat' }" @click="activeFilter = 'chat'">聊天</button>
        <button data-filter="invite" class="filter-chip" :class="{ 'filter-chip--active': activeFilter === 'invite' }" @click="activeFilter = 'invite'">邀请</button>
      </view>

      <view class="summary-row">
        <view class="summary-pill">
          <text class="summary-value">{{ summary.unreadSystemCount }}</text>
          <text class="summary-label">系统</text>
        </view>
        <view class="summary-pill">
          <text class="summary-value">{{ summary.unreadChatCount }}</text>
          <text class="summary-label">聊天</text>
        </view>
        <view class="summary-pill">
          <text class="summary-value">{{ summary.pendingInvitesCount }}</text>
          <text class="summary-label">待处理</text>
        </view>
      </view>

      <view v-if="messagesQuery.isLoading.value" class="notice-list">
        <view class="notice-card">
          <text class="notice-title">正在加载消息</text>
          <text class="notice-copy">正在同步你的最新动态...</text>
        </view>
      </view>

      <view v-else-if="messagesQuery.isError.value" class="notice-list">
        <view class="notice-card">
          <text class="notice-title">加载失败</text>
          <text class="notice-copy">暂时无法加载你的消息，请稍后再试。</text>
        </view>
      </view>

      <view v-else class="notice-list">
        <view v-if="activeFilter === 'chat' && threadItems.length === 0" class="notice-card">
          <text class="notice-title">还没有局内聊天</text>
          <text class="notice-copy">等球局申请通过后，你就能在这里进入聊天了。</text>
        </view>

        <view
          v-for="item in threadItems"
          :key="item.id"
          class="notice-card notice-card--interactive"
          data-testid="thread-card"
          @click="openChatThread(item.id)"
        >
          <text class="notice-title">{{ item.title }}</text>
          <text class="notice-copy">{{ item.venueName }}</text>
          <text class="notice-copy">{{ item.latestMessagePreview }}</text>
          <text class="notice-meta">{{ formatThreadMeta(item.status, item.unreadCount, item.participantCount) }}</text>
        </view>

        <view
          v-if="activeFilter !== 'chat' && filteredMessages.length === 0 && threadItems.length === 0"
          class="notice-card"
        >
          <text class="notice-title">这里还没有新消息</text>
          <text class="notice-copy">有新的审核结果、邀请或提醒时，会第一时间出现在这里。</text>
        </view>

        <view
          v-for="item in filteredMessages"
          :key="item.id"
          class="notice-card"
          :class="{
            'notice-card--accent': item.kind !== 'chat',
            'notice-card--interactive': Boolean(item.matchId),
          }"
          :data-testid="`message-card-${item.id}`"
          @click="openMessageTarget(item.matchId)"
        >
          <view class="notice-head">
            <text class="notice-title">{{ item.title }}</text>
            <text v-if="getMessageStatusLabel(item.status)" class="notice-badge">
              {{ getMessageStatusLabel(item.status) }}
            </text>
          </view>
          <text class="notice-copy">{{ item.content }}</text>
          <button
            v-if="item.status === 'rejected'"
            class="notice-action"
            :data-testid="`message-action-${item.id}`"
            @click.stop="openSquare"
          >
            去广场看看
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
  background: linear-gradient(180deg, #f6efe5 0%, $color-bg 46%, #fffdf8 100%);
}

.hero {
  padding: 32rpx;
  border-radius: 30rpx;
  background: linear-gradient(145deg, #0f1c2e 0%, #223752 100%);
  box-shadow: $shadow-card;
}

.eyebrow {
  display: block;
  color: rgba(255, 255, 255, 0.68);
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.title {
  display: block;
  margin-top: 12rpx;
  color: #fff;
  font-size: 44rpx;
  font-weight: 800;
}

.subtitle {
  display: block;
  margin-top: 16rpx;
  color: rgba(255, 255, 255, 0.82);
  font-size: 24rpx;
  line-height: 1.6;
}

.panel {
  margin-top: 28rpx;
}

.filter-row {
  display: flex;
  gap: 14rpx;
  margin-bottom: 18rpx;
  overflow-x: auto;
}

.filter-chip {
  margin: 0;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 700;
}

.filter-chip--active {
  background: $color-primary;
  color: #fff;
}

.summary-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16rpx;
}

.summary-pill {
  padding: 22rpx 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 253, 249, 0.94);
  box-shadow: $shadow-card;
  text-align: center;
}

.summary-value {
  display: block;
  color: $color-primary;
  font-size: 34rpx;
  font-weight: 800;
}

.summary-label {
  display: block;
  margin-top: 8rpx;
  color: $color-muted;
  font-size: 22rpx;
}

.notice-list {
  margin-top: 22rpx;
}

.notice-card {
  margin-top: 16rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: rgba(255, 253, 249, 0.94);
  box-shadow: $shadow-card;
}

.notice-card--interactive {
  cursor: pointer;
}

.notice-card--accent {
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.14), rgba(255, 253, 249, 0.96));
}

.notice-title {
  display: block;
  color: $color-ink;
  font-size: 28rpx;
  font-weight: 800;
}

.notice-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}

.notice-badge {
  flex-shrink: 0;
  padding: 8rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(255, 106, 61, 0.12);
  color: $color-primary;
  font-size: 20rpx;
  font-weight: 800;
}

.notice-copy {
  display: block;
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 24rpx;
  line-height: 1.6;
}

.notice-meta {
  display: block;
  margin-top: 10rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.notice-action {
  margin: 18rpx 0 0;
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
  font-size: 22rpx;
  font-weight: 800;
}

.login-button {
  margin-top: 20rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
}
</style>
