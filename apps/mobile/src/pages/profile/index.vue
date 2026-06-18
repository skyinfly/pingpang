<script setup lang="ts">
import { computed } from 'vue';
import { useProfileReviewsQuery } from '../../composables/useProfileReviewsQuery';
import { useMyMatchesQuery } from '../../composables/useMyMatchesQuery';
import { useJoinedMatchesQuery } from '../../composables/useJoinedMatchesQuery';
import { useAuthStore } from '../../stores/auth';
import { formatLevel, formatReviewTag } from '../../utils/copy';
import type { MatchCard, MatchLifecycle } from '../../services/types';
import LocationHeader from '../../components/LocationHeader.vue';
import AppToast from '../../components/AppToast.vue';
import AppModal from '../../components/AppModal.vue';

const authStore = useAuthStore();
const activeUserId = computed(() => authStore.user?.id ?? '');
const isAuthenticated = computed(() => Boolean(authStore.token && authStore.user));
const profileQuery = useProfileReviewsQuery(activeUserId);
const myMatchesQuery = useMyMatchesQuery(activeUserId);
const joinedMatchesQuery = useJoinedMatchesQuery(activeUserId);
const profile = computed(() => profileQuery.data.value);
const myMatches = computed(() => myMatchesQuery.data.value?.items ?? []);
const joinedMatches = computed(() => joinedMatchesQuery.data.value?.items ?? []);

/**
 * Sort matches into life-cycle buckets so the page can render them in
 * sections. Falls back to a client-side computation when the server
 * didn't send a lifecycle (older API revisions / cached responses).
 */
function deriveLifecycle(match: MatchCard): MatchLifecycle {
  if (match.lifecycle) return match.lifecycle;
  if (match.status === 'cancelled') return 'cancelled';
  const start = new Date(match.startTime).getTime();
  const now = Date.now();
  if (start > now) return 'upcoming';
  if (now - start <= 2 * 60 * 60 * 1000) return 'live';
  return 'completed';
}

function groupByLifecycle(matches: MatchCard[]) {
  const upcoming: MatchCard[] = [];
  const live: MatchCard[] = [];
  const history: MatchCard[] = []; // completed + cancelled combined for the UI
  for (const match of matches) {
    const lifecycle = deriveLifecycle(match);
    if (lifecycle === 'live') live.push(match);
    else if (lifecycle === 'upcoming') upcoming.push(match);
    else history.push(match);
  }
  return { live, upcoming, history };
}

const myMatchesGroups = computed(() => groupByLifecycle(myMatches.value));
const joinedMatchesGroups = computed(() => groupByLifecycle(joinedMatches.value));

/** Total history count = hosted + joined history, deduped by match id. */
const historyTotal = computed(() => {
  const ids = new Set<string>();
  for (const m of myMatchesGroups.value.history) ids.add(m.id);
  for (const m of joinedMatchesGroups.value.history) ids.add(m.id);
  return ids.size;
});

function openHistory() {
  uni.navigateTo({ url: '/pages/history-matches/index' });
}

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

function openEditProfile() {
  uni.navigateTo({
    url: '/pages/edit-profile/index',
  });
}

function openLegalPage(path: string) {
  uni.navigateTo({ url: path });
}
</script>

<template>
  <view class="page">
    <LocationHeader />
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
        <view class="hero-top">
          <view>
            <text class="eyebrow">信用档案</text>
            <text class="name">{{ profile?.user.nickname ?? '正在加载资料...' }}</text>
            <text class="meta">{{ profileMeta }}</text>
          </view>
          <view v-if="authStore.user?.avatarUrl" class="avatar-wrap">
            <image :src="authStore.user.avatarUrl" class="avatar" mode="aspectFill" />
          </view>
        </view>
        <view class="hero-actions">
          <button class="ghost-action" data-testid="edit-profile-entry" @click="openEditProfile">编辑资料</button>
          <button class="logout-button" data-testid="logout-action" @click="handleLogout">退出登录</button>
        </view>
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

        <!-- 进行中 -->
        <template v-if="myMatchesGroups.live.length > 0">
          <text class="lifecycle-heading lifecycle-heading--live">进行中</text>
          <view
            v-for="item in myMatchesGroups.live"
            :key="item.id"
            class="hosted-card hosted-card--live"
            data-testid="hosted-match-card"
            @click="openMatchDetail(item.id)"
          >
            <text class="hosted-title">
              {{ item.title }}
              <text class="hosted-status-tag hosted-status-tag--live">进行中</text>
            </text>
            <text class="hosted-copy">{{ item.venueName }}</text>
            <text class="hosted-copy">{{ formatStartTime(item.startTime) }} · {{ formatLevel(item.level) }}</text>
            <text class="hosted-meta">还有 {{ item.openSlots }} 个空位 · 匹配度 {{ item.matchRate }}%</text>
          </view>
        </template>

        <!-- 未开始 -->
        <template v-if="myMatchesGroups.upcoming.length > 0">
          <text class="lifecycle-heading">未开始</text>
          <view
            v-for="item in myMatchesGroups.upcoming"
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
        </template>

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

        <!-- 进行中 -->
        <template v-if="joinedMatchesGroups.live.length > 0">
          <text class="lifecycle-heading lifecycle-heading--live">进行中</text>
          <view
            v-for="item in joinedMatchesGroups.live"
            :key="item.id"
            class="hosted-card joined-card hosted-card--live"
            data-testid="joined-match-card"
            @click="openMatchDetail(item.id)"
          >
            <text class="hosted-title">
              {{ item.title }}
              <text class="hosted-status-tag hosted-status-tag--live">进行中</text>
            </text>
            <text class="hosted-copy">{{ item.venueName }}</text>
            <text class="hosted-copy">{{ formatStartTime(item.startTime) }} · {{ formatLevel(item.level) }}</text>
            <text class="hosted-meta">现在正在打，记得到场。</text>
          </view>
        </template>

        <!-- 未开始 -->
        <template v-if="joinedMatchesGroups.upcoming.length > 0">
          <text class="lifecycle-heading">未开始</text>
          <view
            v-for="item in joinedMatchesGroups.upcoming"
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
        </template>

      </view>

      <!-- Unified history entry: hosted + joined combined into one
           tappable row that links to /pages/history-matches. Both
           halves are merged + role-tagged on that page. -->
      <view
        v-if="historyTotal > 0"
        class="history-entry"
        data-testid="history-entry"
        @click="openHistory()"
      >
        <text class="history-entry-label">历史球局</text>
        <text class="history-entry-meta">{{ historyTotal }} 场</text>
        <text class="history-entry-arrow">›</text>
      </view>

    </template>

    <!-- Legal footer: always visible at the bottom of the profile tab so
         users can find privacy + terms even after login. -->
    <view class="legal-footer">
      <text class="legal-link" data-testid="profile-terms" @click="openLegalPage('/pages/legal/terms')">用户协议</text>
      <text class="legal-divider">·</text>
      <text class="legal-link" data-testid="profile-privacy" @click="openLegalPage('/pages/legal/privacy')">隐私政策</text>
    </view>

    <AppToast />
    <AppModal />
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

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20rpx;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 999rpx;
  border: 3rpx solid rgba(255, 255, 255, 0.28);
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

.hero-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 20rpx;
}

.legal-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  margin-top: 48rpx;
  padding-bottom: 24rpx;
}
.legal-link {
  font-size: 24rpx;
  color: #7a8699;
}
.legal-divider {
  font-size: 24rpx;
  color: #c9d1de;
}

.ghost-action,
.logout-button {
  flex: 1;
  min-height: 78rpx;
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 700;
}

.ghost-action {
  background: rgba(255, 255, 255, 0.32);
  color: #ffffff;
}

.logout-button {
  margin-top: 20rpx;
  width: 100%;
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

.hero-actions .logout-button {
  margin-top: 0;
  width: auto;
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

.hosted-card--cancelled {
  background: #f5f0ea;
  opacity: 0.85;
}

.hosted-status-tag {
  display: inline-block;
  margin-left: 12rpx;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  background: rgba(180, 58, 44, 0.14);
  color: #8e2e22;
  font-size: 20rpx;
  font-weight: 800;
}
.hosted-status-tag--live {
  background: rgba(31, 143, 67, 0.16);
  color: #1f6f3f;
}

/* Section heading between lifecycle buckets ("进行中" / "未开始" / "历史球局"). */
.lifecycle-heading {
  display: block;
  margin-top: 24rpx;
  margin-bottom: -4rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: $color-muted;
  letter-spacing: 1rpx;
}
.lifecycle-heading--live { color: #1f6f3f; }
.lifecycle-heading--history { color: $color-muted; }

.hosted-card--live {
  border: 2rpx solid rgba(31, 143, 67, 0.32);
}
.hosted-card--history {
  background: #f3eee6;
  opacity: 0.86;
}
.hosted-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}
.hosted-delete {
  font-size: 22rpx;
  font-weight: 700;
  color: #c0461d;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(255, 244, 236, 0.85);
  cursor: pointer;
}
.hosted-delete--busy { opacity: 0.5; }

/* Compact "历史球局 (N) ›" entry row that links to the dedicated page. */
.history-entry {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 16rpx;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: rgba(15, 28, 46, 0.04);
  cursor: pointer;
}
.history-entry-label {
  flex: 1;
  font-size: 26rpx;
  font-weight: 700;
  color: $color-ink;
}
.history-entry-meta {
  font-size: 24rpx;
  color: $color-muted;
}
.history-entry-arrow {
  font-size: 30rpx;
  color: $color-muted;
  margin-left: 4rpx;
}
</style>
