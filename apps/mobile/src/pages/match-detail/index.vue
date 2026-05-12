<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  applyToMatch,
  approveHostedApplication,
  fetchMatchById,
  fetchMyMatchApplicationStatus,
  listHostedApplications,
  rejectHostedApplication,
} from '../../services/api';
import type { HostedMatchApplication, MatchCard, MyMatchApplicationStatus } from '../../services/types';
import { useAuthStore } from '../../stores/auth';
import { formatLevel } from '../../utils/copy';
import { useJoinedMatchesQuery } from '../../composables/useJoinedMatchesQuery';

const authStore = useAuthStore();
const activeUserId = computed(() => authStore.user?.id ?? '');
const joinedMatchesQuery = useJoinedMatchesQuery(activeUserId);

const loading = ref(true);
const failed = ref(false);
const match = ref<MatchCard | null>(null);
const submitting = ref(false);
const applied = ref(false);
const joinError = ref('');
const hostedApplications = ref<HostedMatchApplication[]>([]);
const applicationsLoading = ref(false);
const hostActionError = ref('');
const myApplicationStatus = ref<MyMatchApplicationStatus>({ status: 'none' });
const myApplicationLoading = ref(false);
const activeRejectApplicationId = ref('');
const selectedRejectReason = ref('');

const rejectReasonOptions = [
  '这场局更适合中高级球友',
  '当前席位想优先留给时间更匹配的球友',
  '这次想先保持现有组局节奏，后面有空位再联系你',
];

const isHost = computed(() => {
  if (!match.value || !authStore.user?.id) {
    return false;
  }

  return match.value.hostUserId === authStore.user.id;
});

const pendingApplications = computed(() => hostedApplications.value.filter((item) => item.status === 'pending'));
const approvedApplications = computed(() => hostedApplications.value.filter((item) => item.status === 'approved'));
const rejectedApplications = computed(() => hostedApplications.value.filter((item) => item.status === 'rejected'));
const isJoined = computed(() =>
  Boolean(match.value && (joinedMatchesQuery.data.value?.items ?? []).some((item) => item.id === match.value?.id)),
);
const isMember = computed(() => isJoined.value || myApplicationStatus.value.status === 'approved');
const isRejected = computed(() => myApplicationStatus.value.status === 'rejected');
const isPendingApplication = computed(() => myApplicationStatus.value.status === 'pending');
const isStarted = computed(() => {
  if (!match.value) {
    return false;
  }

  const startedAt = new Date(match.value.startTime).getTime();
  return Number.isFinite(startedAt) && startedAt <= Date.now();
});
const isFull = computed(() => Boolean(match.value && match.value.openSlots <= 0));

const ctaLabel = computed(() => {
  if (submitting.value) {
    return '提交申请中...';
  }

  if (isMember.value) {
    return '去局内聊天';
  }

  if (isStarted.value) {
    return '球局已开打';
  }

  if (isFull.value) {
    return '席位已满';
  }

  if (isRejected.value) {
    return '去广场看看';
  }

  if (applied.value || isPendingApplication.value) {
    return '已申请';
  }

  if (!authStore.token) {
    return '登录后加入';
  }

  return '加入球局';
});

const ctaDescription = computed(() => {
  if (isMember.value) {
    return '你已经加入这场球局，可以直接去局内聊天和大家确认到场安排。';
  }

  if (isStarted.value) {
    return '这场球局已经开打，去广场看看其他未开打的球友约球吧。';
  }

  if (isFull.value) {
    return '这场球局席位已满，留意一下下一场或挑别的时段。';
  }

  if (isRejected.value) {
    return myApplicationStatus.value.reason ?? '这场球局当前更适合其他安排，你可以换个时间段继续约。';
  }

  if (applied.value || isPendingApplication.value) {
    return '申请已经发出，等主理人确认后你就会进入局内聊天。';
  }

  return '先提交申请，主理人确认后你就会进入局内聊天。';
});

const isCtaDisabled = computed(
  () =>
    !match.value ||
    myApplicationLoading.value ||
    submitting.value ||
    applied.value ||
    isPendingApplication.value ||
    (!isMember.value && (isStarted.value || isFull.value)),
);

function getMatchIdFromLocation() {
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

function buildLoginRedirect(id: string) {
  return `/pages/login/index?redirect=${encodeURIComponent(`/pages/match-detail/index?id=${id}`)}`;
}

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

async function loadHostedApplications() {
  if (!match.value || !isHost.value) {
    hostedApplications.value = [];
    return;
  }

  applicationsLoading.value = true;
  hostActionError.value = '';

  try {
    const response = await listHostedApplications(match.value.id);
    hostedApplications.value = response.items;
  } catch {
    hostActionError.value = '申请列表加载失败，请稍后再试。';
  } finally {
    applicationsLoading.value = false;
  }
}

async function loadMyApplicationStatus() {
  if (!match.value || !authStore.token || isHost.value) {
    myApplicationStatus.value = { status: 'none' };
    return;
  }

  myApplicationLoading.value = true;

  try {
    myApplicationStatus.value = await fetchMyMatchApplicationStatus(match.value.id);
  } catch {
    myApplicationStatus.value = { status: 'none' };
  } finally {
    myApplicationLoading.value = false;
  }
}

async function loadMatch(id: string) {
  loading.value = true;
  failed.value = false;
  joinError.value = '';

  try {
    match.value = await fetchMatchById(id);
  } catch {
    failed.value = true;
    match.value = null;
  } finally {
    loading.value = false;
  }
}

async function handleJoin() {
  if (!match.value || submitting.value || applied.value || isHost.value) {
    return;
  }

  if (isMember.value) {
    uni.navigateTo({
      url: `/pages/chat/index?threadId=${encodeURIComponent(match.value.id)}`,
    });
    return;
  }

  if (isStarted.value || isFull.value) {
    return;
  }

  if (isRejected.value) {
    if (typeof uni.switchTab === 'function') {
      uni.switchTab({
        url: '/pages/square/index',
      });
      return;
    }

    uni.navigateTo({
      url: '/pages/square/index',
    });
    return;
  }

  if (!authStore.token) {
    uni.navigateTo({
      url: buildLoginRedirect(match.value.id),
    });
    return;
  }

  submitting.value = true;
  joinError.value = '';

  try {
    await applyToMatch(match.value.id);
    applied.value = true;
    myApplicationStatus.value = {
      status: 'pending',
      matchId: match.value.id,
      userId: authStore.user?.id,
    };
  } catch {
    joinError.value = '申请失败，请稍后再试。';
  } finally {
    submitting.value = false;
  }
}

async function handleApprove(applicationId: string) {
  if (!match.value) {
    return;
  }

  hostActionError.value = '';
  activeRejectApplicationId.value = '';
  selectedRejectReason.value = '';

  try {
    const updated = (await approveHostedApplication(match.value.id, applicationId)) as HostedMatchApplication;
    hostedApplications.value = hostedApplications.value.map((item) => (item.id === applicationId ? updated : item));

    if (match.value) {
      match.value = {
        ...match.value,
        openSlots: Math.max(match.value.openSlots - 1, 0),
      };
    }
  } catch {
    hostActionError.value = '同意失败，请稍后再试。';
  }
}

function startRejectFlow(applicationId: string) {
  activeRejectApplicationId.value = applicationId;
  selectedRejectReason.value = rejectReasonOptions[0] ?? '';
  hostActionError.value = '';
}

function cancelRejectFlow() {
  activeRejectApplicationId.value = '';
  selectedRejectReason.value = '';
}

async function handleReject(applicationId: string) {
  if (!match.value) {
    return;
  }

  hostActionError.value = '';

  try {
    const updated = (await rejectHostedApplication(
      match.value.id,
      applicationId,
      selectedRejectReason.value || rejectReasonOptions[0],
    )) as HostedMatchApplication;
    hostedApplications.value = hostedApplications.value.map((item) => (item.id === applicationId ? updated : item));
    cancelRejectFlow();
  } catch {
    hostActionError.value = '拒绝失败，请稍后再试。';
  }
}

watch(
  isHost,
  (value) => {
    if (value) {
      void loadHostedApplications();
      myApplicationStatus.value = { status: 'none' };
      return;
    }

    hostedApplications.value = [];
    if (match.value && authStore.token) {
      void loadMyApplicationStatus();
    }
  },
  { immediate: true },
);

watch(
  () => [match.value?.id, authStore.token, authStore.user?.id] as const,
  ([matchId, token]) => {
    if (!matchId || !token || isHost.value) {
      myApplicationStatus.value = { status: 'none' };
      return;
    }

    void loadMyApplicationStatus();
  },
  { immediate: true },
);

const initialMatchId = getMatchIdFromLocation();

if (initialMatchId) {
  void loadMatch(initialMatchId);
} else {
  loading.value = false;
  failed.value = true;
}
</script>

<template>
  <view class="page">
    <view v-if="loading" class="state-card">
      <text class="state-title">正在加载球局详情...</text>
      <text class="state-copy">稍等一下，我们把这场球局的规则和席位信息带出来。</text>
    </view>

    <view v-else-if="failed || !match" class="state-card">
      <text class="state-title">没有找到这场球局</text>
      <text class="state-copy">你可以回到首页或广场，再挑一场更合适的。</text>
    </view>

    <template v-else>
      <view class="hero">
        <text class="eyebrow">推荐球局</text>
        <text class="title">{{ match.title }}</text>
        <text class="subtitle">{{ match.venueName }} · {{ match.city }}</text>
      </view>

      <view class="panel">
        <text class="panel-label">开局时间</text>
        <text class="panel-value">{{ formatStartTime(match.startTime) }}</text>
      </view>

      <view class="panel">
        <text class="panel-label">推荐理由</text>
        <text class="panel-value">
          距离 {{ match.distanceKm }}km，匹配度 {{ match.matchRate }}%，主理人信用 {{ match.hostCreditScore }}
        </text>
      </view>

      <view class="panel">
        <text class="panel-label">当前席位</text>
        <text class="panel-value">
          还剩 {{ match.openSlots }} 个空位，适合 {{ formatLevel(match.level) }} 水平球友补位
        </text>
      </view>

      <view class="panel panel-last">
        <text class="panel-label">赛后信用</text>
        <text class="panel-value">完成后可互评，准时和沟通评分会进入个人信用分。</text>

        <view class="tag-row">
          <text class="tag">准时到场 +1</text>
          <text class="tag">沟通顺畅 +1</text>
          <text class="tag tag-warn">爽约 -3</text>
        </view>
      </view>

      <view v-if="isHost" class="panel panel-last">
        <text class="panel-label">待你处理的申请</text>
        <text class="panel-value">审核通过后，对方才能进入局内聊天和你确认到场安排。</text>
        <text v-if="hostActionError" class="error-copy">{{ hostActionError }}</text>

        <view v-if="applicationsLoading" class="application-card">
          <text class="application-name">正在加载申请列表...</text>
        </view>

        <view v-else-if="pendingApplications.length === 0" class="application-card">
          <text class="application-name">现在还没有新的申请</text>
          <text class="application-meta">有人申请加入时，你可以在这里直接同意或拒绝。</text>
        </view>

        <view v-for="item in pendingApplications" :key="item.id" class="application-card">
          <text class="application-name">{{ item.applicantNickname }}</text>
          <text class="application-meta">
            {{ item.applicantCity }} · {{ formatLevel(item.applicantLevel) }} · 信用 {{ item.applicantCreditScore }}
          </text>
          <text class="application-status">等待你确认</text>

          <view class="application-actions">
            <button class="application-button application-button--primary" :data-testid="`approve-application-${item.id}`" @click="handleApprove(item.id)">
              同意加入
            </button>
            <button class="application-button application-button--secondary" :data-testid="`reject-application-${item.id}`" @click="startRejectFlow(item.id)">
              暂不通过
            </button>
          </view>

          <view v-if="activeRejectApplicationId === item.id" class="reject-panel">
            <text class="reject-title">确认暂不通过</text>
            <text class="reject-copy">选一个更贴近这次决定的原因，对方会在球局详情和消息中心看到这条说明。</text>

            <button
              v-for="(reason, index) in rejectReasonOptions"
              :key="reason"
              class="reject-option"
              :class="{ 'reject-option--active': selectedRejectReason === reason }"
              :data-testid="`reject-reason-option-${index + 1}`"
              @click="selectedRejectReason = reason"
            >
              {{ reason }}
            </button>

            <view class="application-actions">
              <button class="application-button application-button--ghost" @click="cancelRejectFlow">
                先不处理
              </button>
              <button
                class="application-button application-button--primary"
                :data-testid="`confirm-reject-application-${item.id}`"
                @click="handleReject(item.id)"
              >
                确认暂不通过
              </button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="isHost" class="panel panel-last">
        <text class="panel-label">已加入的球友</text>
        <text class="panel-value">这些球友已经通过审核，可以直接在局内聊天里一起确认到场安排。</text>

        <view v-if="approvedApplications.length === 0" class="application-card">
          <text class="application-name">还没有已通过成员</text>
          <text class="application-meta">你同意申请后，成员会出现在这里。</text>
        </view>

        <view v-for="item in approvedApplications" :key="item.id" class="application-card">
          <text class="application-name">{{ item.applicantNickname }}</text>
          <text class="application-meta">
            {{ item.applicantCity }} · {{ formatLevel(item.applicantLevel) }} · 信用 {{ item.applicantCreditScore }}
          </text>
          <text class="application-status">已同意加入</text>
        </view>
      </view>

      <view v-if="isHost" class="panel panel-last">
        <text class="panel-label">暂未通过的申请</text>
        <text class="panel-value">这部分申请已经处理完成，后面如果你调整席位，也可以再联系对方补位。</text>

        <view v-if="rejectedApplications.length === 0" class="application-card">
          <text class="application-name">还没有暂未通过的申请</text>
          <text class="application-meta">你拒绝申请后，记录会留在这里方便回看。</text>
        </view>

        <view v-for="item in rejectedApplications" :key="item.id" class="application-card">
          <text class="application-name">{{ item.applicantNickname }}</text>
          <text class="application-meta">
            {{ item.applicantCity }} · {{ formatLevel(item.applicantLevel) }} · 信用 {{ item.applicantCreditScore }}
          </text>
          <text class="application-status application-status--muted">这次暂未通过</text>
          <text v-if="item.decisionReason" class="application-meta">{{ item.decisionReason }}</text>
        </view>
      </view>

      <view v-else class="cta-bar" data-testid="join-bar">
        <view class="cta-copy">
          <text class="cta-title">
            {{
              isMember
                ? '你已经加入这场球局'
                : isRejected
                  ? '这次申请暂未通过'
                  : '加入这场球局'
            }}
          </text>
          <text class="cta-desc">{{ ctaDescription }}</text>
          <text v-if="joinError" class="error-copy">{{ joinError }}</text>
          <text v-else-if="applied || isPendingApplication" class="success-copy">已申请，等待主理人确认</text>
        </view>

        <button
          type="button"
          class="cta-button"
          data-testid="join-match"
          :disabled="isCtaDisabled"
          @click="handleJoin"
        >
          {{ ctaLabel }}
        </button>
      </view>
    </template>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  padding-bottom: calc(280rpx + env(safe-area-inset-bottom, 0px));
  background:
    radial-gradient(circle at top right, rgba(255, 162, 102, 0.22), transparent 30%),
    linear-gradient(180deg, #fff4e8 0%, $color-bg 50%, #fffdf8 100%);
}

.state-card,
.hero,
.panel {
  border-radius: 30rpx;
  box-shadow: $shadow-card;
}

.state-card,
.panel {
  padding: 28rpx;
  background: rgba(255, 253, 249, 0.95);
}

.hero {
  padding: 32rpx;
  background: linear-gradient(145deg, #0f1c2e 0%, #233954 100%);
}

.eyebrow,
.title,
.subtitle,
.state-title,
.state-copy,
.panel-label,
.panel-value,
.cta-title,
.cta-desc,
.error-copy,
.success-copy,
.application-name,
.application-meta,
.application-status {
  display: block;
}

.eyebrow {
  color: rgba(255, 255, 255, 0.68);
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.title {
  margin-top: 12rpx;
  color: #fff;
  font-size: 46rpx;
  font-weight: 800;
}

.subtitle {
  margin-top: 14rpx;
  color: rgba(255, 255, 255, 0.82);
  font-size: 24rpx;
  line-height: 1.6;
}

.state-card {
  margin-top: 28rpx;
}

.state-title {
  color: $color-ink;
  font-size: 32rpx;
  font-weight: 800;
}

.state-copy,
.panel-value,
.cta-desc,
.application-meta {
  margin-top: 12rpx;
  color: $color-muted;
  font-size: 24rpx;
  line-height: 1.6;
}

.panel {
  margin-top: 20rpx;
}

.panel-label {
  color: $color-ink;
  font-size: 24rpx;
  font-weight: 800;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 18rpx;
}

.tag {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 700;
}

.tag-warn {
  background: rgba(255, 106, 61, 0.12);
  color: $color-primary;
}

.panel-last {
  margin-bottom: 24rpx;
}

.application-card {
  margin-top: 18rpx;
  padding: 22rpx;
  border-radius: 24rpx;
  background: #fff8f1;
}

.application-name {
  color: $color-ink;
  font-size: 28rpx;
  font-weight: 800;
}

.application-status {
  margin-top: 10rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}

.application-status--muted {
  color: $color-muted;
}

.application-actions {
  display: flex;
  gap: 14rpx;
  margin-top: 16rpx;
}

.reject-panel {
  margin-top: 18rpx;
  padding: 20rpx;
  border-radius: 22rpx;
  background: rgba(15, 28, 46, 0.05);
}

.reject-title,
.reject-copy {
  display: block;
}

.reject-title {
  color: $color-ink;
  font-size: 24rpx;
  font-weight: 800;
}

.reject-copy {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 22rpx;
  line-height: 1.6;
}

.reject-option {
  width: 100%;
  margin-top: 12rpx;
  padding: 18rpx 20rpx;
  border-radius: 22rpx;
  background: #fff;
  color: $color-ink;
  font-size: 23rpx;
  font-weight: 700;
  text-align: left;
}

.reject-option--active {
  background: rgba(255, 106, 61, 0.12);
  color: $color-primary;
  box-shadow: inset 0 0 0 2rpx rgba(255, 106, 61, 0.35);
}

.application-button {
  flex: 1;
  margin: 0;
  border-radius: 999rpx;
  min-height: 76rpx;
  font-size: 24rpx;
  font-weight: 800;
}

.application-button--primary {
  background: $color-primary;
  color: #fff;
}

.application-button--secondary {
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
}

.application-button--ghost {
  background: rgba(15, 28, 46, 0.04);
  color: $color-muted;
}

.cta-bar {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: calc(32rpx + env(safe-area-inset-bottom, 0px));
  padding: 24rpx;
  border-radius: 30rpx;
  background: rgba(255, 253, 249, 0.98);
  box-shadow: $shadow-card;
}

.cta-copy {
  margin-bottom: 18rpx;
}

.cta-title {
  color: $color-ink;
  font-size: 28rpx;
  font-weight: 800;
}

.cta-button {
  width: 100%;
  min-height: 90rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ff6a3d 0%, #ff8c56 100%);
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
}

.error-copy {
  margin-top: 12rpx;
  color: #c94a2f;
  font-size: 22rpx;
  font-weight: 700;
}

.success-copy {
  margin-top: 12rpx;
  color: $color-primary;
  font-size: 22rpx;
  font-weight: 700;
}
</style>
