<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQueryClient } from '@tanstack/vue-query';
import { createThreadMessage, markChatThreadRead } from '../../services/api';
import type { MessagePreview } from '../../services/types';
import { useChatMessagesQuery } from '../../composables/useChatMessagesQuery';
import { useThreadDetailQuery } from '../../composables/useThreadDetailQuery';
import { useAuthStore } from '../../stores/auth';
import { formatThreadStatus } from '../../utils/copy';
import { toast } from '../../utils/toast';

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?.id ?? '');
const isAuthenticated = computed(() => Boolean(authStore.token && authStore.user));
const activeThreadId = ref('');
const draft = ref('');
const createdMessages = ref<MessagePreview[]>([]);
const queryClient = useQueryClient();

declare const onLoad:
  | ((callback: (query: Record<string, string | string[] | undefined>) => void) => void)
  | undefined;

function syncThreadId(query: Record<string, string | string[] | undefined>) {
  const threadId =
    typeof query.matchId === 'string'
      ? query.matchId
      : typeof query.threadId === 'string'
        ? query.threadId
        : '';

  activeThreadId.value = threadId;
}

function openLogin() {
  uni.navigateTo({
    url: `/pages/login/index?redirect=${encodeURIComponent(`/pages/chat/index?threadId=${activeThreadId.value}`)}`,
  });
}

function openParticipantProfile(userId: string) {
  if (!userId) {
    return;
  }
  uni.navigateTo({
    url: `/pages/user-profile/index?id=${encodeURIComponent(userId)}`,
  });
}

function formatSchedule(value?: string | null) {
  if (!value) {
    return '时间确认中';
  }

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

if (typeof onLoad === 'function') {
  onLoad((query) => {
    syncThreadId(query);
  });
} else if (typeof window !== 'undefined') {
  const query = Object.fromEntries(new URLSearchParams(window.location.hash.split('?')[1] ?? '').entries());
  syncThreadId(query);
}

const messagesQuery = useChatMessagesQuery({
  userId: () => currentUserId.value,
  threadId: () => activeThreadId.value,
});
const threadDetailQuery = useThreadDetailQuery({
  userId: () => currentUserId.value,
  threadId: () => activeThreadId.value,
});
const thread = computed(() => threadDetailQuery.data.value?.thread ?? null);
const participants = computed(() => threadDetailQuery.data.value?.participants ?? []);
const canUseThread = computed(() => Boolean(isAuthenticated.value && activeThreadId.value));
// Backend returns 409 on POST when the underlying match/thread is
// cancelled — sweep job auto-cancels open matches past their startTime
// with no joiners, and hosts can dissolve manually. Surface this
// clearly instead of letting the input look usable.
const isThreadCancelled = computed(() => thread.value?.status === 'cancelled');
const composerDisabled = computed(() => isThreadCancelled.value || !canUseThread.value);
// Detect "not a member" cleanly. Backend returns 403 from
// `/chat-threads/:id` when the user isn't host or approved member,
// so we trust that as the canonical signal. Without this guard the
// page falls through to its default state and exposes the raw thread
// id (e.g. "聊天线程 cmqi2qsx..."), which looks broken.
const accessDenied = computed(() => {
  const err = threadDetailQuery.error.value as { statusCode?: number } | null;
  return err?.statusCode === 403;
});
function goBackToDetail() {
  if (!activeThreadId.value) return;
  uni.navigateTo({
    url: `/pages/match-detail/index?id=${encodeURIComponent(activeThreadId.value)}`,
  });
}

watch(
  [currentUserId, activeThreadId],
  ([userId, threadId]) => {
    if (!userId || !threadId) {
      return;
    }
    // Skip the read-receipt POST entirely when we already know the user
    // isn't a member — keeps the console clean of inevitable 403s.
    if (accessDenied.value) {
      return;
    }

    void markChatThreadRead(threadId).then(() => {
      void queryClient.invalidateQueries({
        queryKey: ['message-center', userId],
      });
      void queryClient.invalidateQueries({
        queryKey: ['chat-thread-detail', userId, threadId],
      });
    });
  },
  { immediate: true },
);

const timeline = computed(() =>
  [...(messagesQuery.data.value?.items ?? []), ...createdMessages.value].sort((left, right) =>
    left.createdAt.localeCompare(right.createdAt),
  ),
);

const sending = ref(false);
async function handleSend() {
  if (!canUseThread.value || sending.value) return;
  if (isThreadCancelled.value) {
    toast('球局已取消，无法发送消息', 'error');
    return;
  }
  const content = draft.value.trim();
  if (!content) return;

  sending.value = true;
  try {
    const created = await createThreadMessage(activeThreadId.value, content);
    createdMessages.value = [...createdMessages.value, created];
    draft.value = '';
    void queryClient.invalidateQueries({
      queryKey: ['chat-messages', currentUserId.value, activeThreadId.value],
    });
    void queryClient.invalidateQueries({
      queryKey: ['message-center', currentUserId.value],
    });
    void queryClient.invalidateQueries({
      queryKey: ['chat-thread-detail', currentUserId.value, activeThreadId.value],
    });
  } catch (error) {
    const resp = error as { statusCode?: number; data?: { message?: string } };
    if (resp.statusCode === 409) {
      toast('球局已取消，无法发送消息', 'error');
      // Refresh thread so the cancelled banner shows.
      void queryClient.invalidateQueries({
        queryKey: ['chat-thread-detail', currentUserId.value, activeThreadId.value],
      });
    } else if (resp.statusCode === 403) {
      toast('你不是局内成员，无法发送消息', 'error');
    } else {
      toast('发送失败，请稍后再试', 'error');
    }
  } finally {
    sending.value = false;
  }
}
</script>

<template>
  <view class="page">
    <template v-if="!isAuthenticated">
      <view class="empty-state empty-state--full">
        <text class="empty-title">登录后进入局内聊天</text>
        <text class="empty-copy">通过审核后，主理人和球友会在这里确认到场时间、球台和集合方式。</text>
        <button class="composer-button login-button" data-testid="chat-login-entry" @click="openLogin">去登录</button>
      </view>
    </template>

    <template v-else-if="!activeThreadId">
      <view class="empty-state empty-state--full">
        <text class="empty-title">还没有选中聊天会话</text>
        <text class="empty-copy">先从消息或球局详情进入聊天，再继续和球友沟通。</text>
      </view>
    </template>

    <template v-else-if="accessDenied">
      <view class="empty-state empty-state--full" data-testid="chat-access-denied">
        <text class="empty-title">你还不是局内成员</text>
        <text class="empty-copy">先去球局详情申请加入，主理人确认后就能进来聊天。</text>
        <button class="composer-button login-button" data-testid="chat-back-to-detail" @click="goBackToDetail">
          去球局详情
        </button>
      </view>
    </template>

    <template v-else>
      <view class="topline">
        <text class="badge">局内聊天</text>
        <text class="status">{{ formatThreadStatus(thread?.status) }}</text>
      </view>

      <view class="hero-card">
        <text class="hero-title">{{ thread?.title ?? `聊天线程 ${activeThreadId}` }}</text>
        <text class="hero-subtitle">{{ thread?.venueName ?? '正在确认球馆信息...' }}</text>
        <text class="hero-meta">开局时间：{{ formatSchedule(thread?.scheduledAt) }}</text>
        <text class="hero-helper">当前 {{ participants.length }} 位球友在线，开打前可以先同步到场时间。</text>

        <view class="participant-row">
          <view
            v-for="participant in participants"
            :key="participant.userId"
            class="participant-chip"
            :class="{ 'participant-chip--host': participant.role === 'host' }"
            :data-testid="`participant-chip-${participant.userId}`"
            @click="openParticipantProfile(participant.userId)"
          >
            <text class="participant-name">
              {{ participant.nickname }}
              <text v-if="participant.role === 'host'" class="participant-role">主理人</text>
            </text>
            <text class="participant-meta">
              {{ participant.level }} · 信用 {{ participant.creditScore }}
            </text>
          </view>
        </view>
      </view>

      <view class="message-panel" data-testid="chat-scroll">
        <view
          v-for="item in timeline"
          :key="item.id"
          class="bubble"
          :class="{
            'bubble--system': item.kind === 'system',
            'bubble--self': item.senderId === currentUserId,
            'bubble--peer': item.kind !== 'system' && item.senderId !== currentUserId,
          }"
        >
          <text class="bubble-label">{{ item.senderName ?? item.title }}</text>
          <text class="bubble-copy">{{ item.content }}</text>
        </view>

        <view v-if="timeline.length === 0" class="empty-state">
          <text class="empty-title">还没有聊天消息</text>
          <text class="empty-copy">先打个招呼，确认一下到场时间吧。</text>
        </view>
      </view>

      <view v-if="isThreadCancelled" class="cancelled-banner" data-testid="chat-cancelled-banner">
        <text>球局已取消，聊天已封存。</text>
      </view>
      <view class="composer-shell" data-testid="chat-composer">
        <view class="composer">
          <input
            v-model="draft"
            class="composer-input"
            :placeholder="isThreadCancelled ? '球局已取消' : '和球友说点什么...'"
            :disabled="composerDisabled"
          />
          <button
            class="composer-button"
            :disabled="composerDisabled || sending"
            @click="handleSend"
          >
            {{ sending ? '发送中…' : '发送' }}
          </button>
        </view>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - var(--preview-navbar-height, 0px));
  height: calc(100vh - var(--preview-navbar-height, 0px));
  padding: 24rpx;
  background: linear-gradient(180deg, #fff4e8 0%, #fff9f1 100%);
  overflow: hidden;
}

.topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.badge {
  padding: 12rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 700;
}

.status {
  color: $color-primary;
  font-size: 24rpx;
  font-weight: 700;
}

.hero-card {
  flex-shrink: 0;
  margin-top: 16rpx;
  padding: 24rpx;
  border-radius: 28rpx;
  background: rgba(255, 253, 249, 0.96);
  box-shadow: $shadow-card;
}

.hero-title,
.hero-subtitle,
.hero-meta,
.hero-helper,
.bubble-label,
.bubble-copy,
.empty-title,
.empty-copy {
  display: block;
}

.hero-title {
  color: $color-ink;
  font-size: 34rpx;
  font-weight: 800;
}

.hero-subtitle {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 24rpx;
}

.hero-meta {
  margin-top: 10rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.hero-helper {
  margin-top: 12rpx;
  color: $color-muted;
  font-size: 22rpx;
  line-height: 1.5;
}

.participant-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}

.participant-chip {
  display: flex;
  flex-direction: column;
  gap: 2rpx;
  padding: 10rpx 18rpx;
  border-radius: 18rpx;
  background: rgba(15, 28, 46, 0.06);
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 700;
  cursor: pointer;
}

.participant-chip--host {
  background: rgba(255, 106, 61, 0.14);
}

.participant-name {
  display: flex;
  align-items: baseline;
  gap: 8rpx;
}

.participant-role {
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
  font-size: 18rpx;
}

.participant-meta {
  color: $color-muted;
  font-size: 20rpx;
  font-weight: 600;
}

.message-panel {
  flex: 1;
  min-height: 0;
  margin-top: 16rpx;
  padding-right: 6rpx;
  overflow-y: auto;
}

.bubble {
  margin-top: 16rpx;
  padding: 22rpx 24rpx;
  border-radius: 26rpx;
  box-shadow: $shadow-card;
}

.bubble:first-child {
  margin-top: 0;
}

.bubble--system {
  background: rgba(15, 28, 46, 0.9);
}

.bubble--self {
  margin-left: 72rpx;
  background: rgba(255, 106, 61, 0.16);
}

.bubble--peer {
  margin-right: 72rpx;
  background: rgba(255, 253, 249, 0.95);
}

.bubble-label {
  font-size: 22rpx;
  font-weight: 700;
  color: inherit;
}

.bubble--system .bubble-label,
.bubble--system .bubble-copy {
  color: #fff;
}

.bubble-copy {
  margin-top: 10rpx;
  color: $color-ink;
  font-size: 24rpx;
  line-height: 1.6;
}

.empty-state {
  margin-top: 24rpx;
  padding: 32rpx 24rpx;
  border-radius: 28rpx;
  background: rgba(255, 253, 249, 0.94);
  box-shadow: $shadow-card;
  text-align: center;
}

.empty-state--full {
  margin-top: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.empty-title {
  color: $color-ink;
  font-size: 28rpx;
  font-weight: 800;
}

.empty-copy {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 24rpx;
  line-height: 1.5;
}

.cancelled-banner {
  flex-shrink: 0;
  margin: 12rpx 0;
  padding: 14rpx 20rpx;
  border-radius: 16rpx;
  background: rgba(209, 67, 47, 0.10);
  color: #d1432f;
  font-size: 24rpx;
  text-align: center;
}

.composer-shell {
  flex-shrink: 0;
  margin-top: 16rpx;
  padding-top: 8rpx;
  padding-bottom: calc(8rpx + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, rgba(255, 249, 241, 0) 0%, rgba(255, 249, 241, 0.92) 24%, #fff9f1 100%);
}

.composer {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 18rpx;
  border-radius: 28rpx;
  background: rgba(255, 253, 249, 0.96);
  box-shadow: $shadow-card;
}

.composer-input {
  flex: 1;
  min-width: 0;
  padding: 18rpx 22rpx;
  border-radius: 20rpx;
  background: rgba(15, 28, 46, 0.06);
  font-size: 24rpx;
  color: $color-ink;
}

.composer-button {
  margin: 0;
  padding: 0 24rpx;
  min-height: 72rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
  font-size: 24rpx;
  font-weight: 800;
}

.login-button {
  margin-top: 20rpx;
}
</style>
