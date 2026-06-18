<script setup lang="ts">
/**
 * Unified history page. Lists every match the user touched in any
 * role (host or member) whose lifecycle is `completed` or `cancelled`,
 * sorted by start time descending. Each card carries a role badge so
 * the user can tell at a glance which ones they hosted.
 *
 * We deliberately don't render the LocationHeader here — the page is
 * about "things you already did", not "near you", so the location pill
 * would just be noise.
 */
import { computed, ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useMyMatchesQuery } from '../../composables/useMyMatchesQuery';
import { useJoinedMatchesQuery } from '../../composables/useJoinedMatchesQuery';
import { deleteHostedMatch } from '../../services/api';
import type { MatchCard, MatchLifecycle } from '../../services/types';
import { formatLevel } from '../../utils/copy';
import { toast, modal } from '../../utils/toast';
import AppToast from '../../components/AppToast.vue';
import AppModal from '../../components/AppModal.vue';

type Role = 'host' | 'member';
type HistoryItem = { match: MatchCard; role: Role };

const authStore = useAuthStore();
const activeUserId = computed(() => authStore.user?.id ?? '');
const myMatchesQuery = useMyMatchesQuery(activeUserId);
const joinedMatchesQuery = useJoinedMatchesQuery(activeUserId);
const deletingMatchId = ref('');

function deriveLifecycle(match: MatchCard): MatchLifecycle {
  if (match.lifecycle) return match.lifecycle;
  if (match.status === 'cancelled') return 'cancelled';
  const start = new Date(match.startTime).getTime();
  const now = Date.now();
  if (start > now) return 'upcoming';
  if (now - start <= 2 * 60 * 60 * 1000) return 'live';
  return 'completed';
}

function isHistory(match: MatchCard) {
  const l = deriveLifecycle(match);
  return l === 'completed' || l === 'cancelled';
}

/**
 * Merge hosted + joined matches into one list. When the same match
 * appears in both buckets (which only happens during data hand-off
 * across endpoints) we prefer the `host` role since it carries the
 * "可删除" affordance.
 */
const items = computed<HistoryItem[]>(() => {
  const seen = new Map<string, HistoryItem>();
  for (const match of myMatchesQuery.data.value?.items ?? []) {
    if (!isHistory(match)) continue;
    seen.set(match.id, { match, role: 'host' });
  }
  for (const match of joinedMatchesQuery.data.value?.items ?? []) {
    if (!isHistory(match)) continue;
    if (seen.has(match.id)) continue;
    seen.set(match.id, { match, role: 'member' });
  }
  return [...seen.values()].sort(
    (a, b) => new Date(b.match.startTime).getTime() - new Date(a.match.startTime).getTime(),
  );
});

function lifecycleLabel(lifecycle: MatchLifecycle): string {
  switch (lifecycle) {
    case 'upcoming': return '未开始';
    case 'live':     return '进行中';
    case 'completed':return '已结束';
    case 'cancelled':return '已解散';
  }
}

function formatStartTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${m}月${d}日 ${hh}:${mm}`;
}

function openMatchDetail(id: string) {
  uni.navigateTo({ url: `/pages/match-detail/index?id=${encodeURIComponent(id)}` });
}

function canHostDelete(item: HistoryItem) {
  if (item.role !== 'host') return false;
  const l = deriveLifecycle(item.match);
  if (l === 'cancelled') return true;
  if (l === 'completed' && item.match.openSlots === item.match.maxPlayers) return true;
  return false;
}

async function handleDelete(item: HistoryItem) {
  if (deletingMatchId.value) return;
  const ok = await modal({
    title: '删除这条球局记录？',
    content: '删除后无法恢复，仅会清掉你这条记录，不会影响其他球友的历史。',
    confirmText: '确认删除',
    cancelText: '再想想',
    showCancel: true,
  });
  if (!ok.confirm) return;
  deletingMatchId.value = item.match.id;
  try {
    await deleteHostedMatch(item.match.id);
    toast('已删除', 'success');
    await myMatchesQuery.refetch();
  } catch (error) {
    const resp = error as { statusCode?: number; data?: { message?: string } };
    if (resp.statusCode === 409) toast('这场球局还有人参加或仍在进行，不能删除', 'error');
    else if (resp.statusCode === 403) toast('只有主理人能删除自己的球局', 'error');
    else toast('删除失败，请稍后再试', 'error');
  } finally {
    deletingMatchId.value = '';
  }
}
</script>

<template>
  <view class="page">
    <view class="summary">
      <text class="summary-title">历史球局</text>
      <text class="summary-meta">共 {{ items.length }} 场</text>
    </view>

    <view v-if="items.length === 0" class="empty">
      <text class="empty-title">没有历史球局</text>
      <text class="empty-copy">已经结束或者解散的球局会自动出现在这里。</text>
    </view>

    <view
      v-for="item in items"
      :key="item.match.id"
      class="card"
      :class="{ 'card--cancelled': item.match.status === 'cancelled' }"
      @click="openMatchDetail(item.match.id)"
    >
      <view class="card-head">
        <view class="card-head-left">
          <text class="role-badge" :class="`role-badge--${item.role}`">
            {{ item.role === 'host' ? '主理人' : '参与者' }}
          </text>
          <text class="card-title">{{ item.match.title }}</text>
        </view>
        <text class="status-tag">{{ lifecycleLabel(deriveLifecycle(item.match)) }}</text>
      </view>
      <text class="card-line">{{ item.match.venueName }}</text>
      <text class="card-line">{{ formatStartTime(item.match.startTime) }} · {{ formatLevel(item.match.level) }}</text>
      <text class="card-meta">
        <template v-if="item.match.status === 'cancelled'">
          <template v-if="item.role === 'host'">已解散，球友已通过消息中心收到通知。</template>
          <template v-else>主理人已解散这场球局。</template>
        </template>
        <template v-else-if="item.role === 'host' && item.match.openSlots === item.match.maxPlayers">没有球友加入这场球局。</template>
        <template v-else>球局已结束。</template>
      </text>
      <view v-if="canHostDelete(item)" class="card-actions">
        <text
          class="card-delete"
          :class="{ 'card-delete--busy': deletingMatchId === item.match.id }"
          @click.stop="handleDelete(item)"
        >{{ deletingMatchId === item.match.id ? '删除中…' : '删除记录' }}</text>
      </view>
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
  padding-bottom: calc(48rpx + env(safe-area-inset-bottom, 0px));
  background: $color-bg;
}
.summary {
  display: flex;
  align-items: baseline;
  gap: 16rpx;
  margin-bottom: 24rpx;
}
.summary-title {
  font-size: 40rpx;
  font-weight: 800;
  color: $color-ink;
}
.summary-meta {
  font-size: 22rpx;
  color: $color-muted;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 32rpx;
  color: $color-muted;
}
.empty-title {
  font-size: 32rpx;
  font-weight: 800;
  color: $color-ink;
  margin-bottom: 12rpx;
}
.empty-copy {
  font-size: 24rpx;
  text-align: center;
  line-height: 1.6;
}
.card {
  margin-bottom: 16rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #ffffff;
  box-shadow: 0 4rpx 12rpx rgba(15, 28, 46, 0.05);
  cursor: pointer;
}
.card--cancelled {
  background: #f5f0ea;
  opacity: 0.86;
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.card-head-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
  flex: 1;
  min-width: 0;
}
.card-title {
  font-size: 28rpx;
  font-weight: 800;
  color: $color-ink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.role-badge {
  flex-shrink: 0;
  font-size: 20rpx;
  font-weight: 800;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
}
.role-badge--host {
  background: rgba(255, 106, 61, 0.16);
  color: $color-primary;
}
.role-badge--member {
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
}
.status-tag {
  flex-shrink: 0;
  font-size: 20rpx;
  font-weight: 800;
  padding: 2rpx 12rpx;
  border-radius: 999rpx;
  background: rgba(180, 58, 44, 0.14);
  color: #8e2e22;
}
.card-line {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: $color-muted;
}
.card-meta {
  display: block;
  margin-top: 10rpx;
  font-size: 22rpx;
  font-weight: 700;
  color: $color-primary;
}
.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12rpx;
}
.card-delete {
  font-size: 22rpx;
  font-weight: 700;
  color: #c0461d;
  padding: 6rpx 14rpx;
  border-radius: 999rpx;
  background: rgba(255, 244, 236, 0.85);
  cursor: pointer;
}
.card-delete--busy { opacity: 0.5; }
</style>
