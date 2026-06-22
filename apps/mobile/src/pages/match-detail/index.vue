<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  applyToMatch,
  approveHostedApplication,
  cancelHostedMatch,
  ensureMatchCheckInCode,
  fetchMatchById,
  fetchMatchCheckIns,
  fetchMyMatchApplicationStatus,
  fetchReviewProfile,
  listHostedApplications,
  rejectHostedApplication,
  leaveMatch,
  reportUser,
  submitMatchCheckIn,
  submitReview,
  updateHostedMatch,
} from '../../services/api';
import type { HostedMatchApplication, MatchCard, MyMatchApplicationStatus } from '../../services/types';
import { useAuthStore } from '../../stores/auth';
import { useLocationStore } from '../../stores/location';
import { formatLevel } from '../../utils/copy';
import { formatDistance } from '../../utils/geo';
import { toast, modal } from '../../utils/toast';
import { useJoinedMatchesQuery } from '../../composables/useJoinedMatchesQuery';
import { resolveApiBaseUrl } from '../../services/http';
import AppToast from '../../components/AppToast.vue';
import AppModal from '../../components/AppModal.vue';

const authStore = useAuthStore();
const locationStore = useLocationStore();
// Warm location cache so the next loadMatch() can ask the backend for a
// live-computed distance instead of the stored default.
void locationStore.ensure();
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
const cancelling = ref(false);
const cancelError = ref('');
const checkInCode = ref('');
const checkInCodeLoading = ref(false);
const checkInCodeError = ref('');
const checkIns = ref<Array<{ userId: string; nickname: string; level: string; creditScore: number; role: string; checkedInAt: string | null }>>([]);
const memberCheckInInput = ref('');
const memberCheckInError = ref('');
const memberCheckedIn = ref(false);
const memberCheckInBusy = ref(false);
const reportTarget = ref<{ userId: string; nickname: string } | null>(null);
const reportReason = ref('');
const reportSubmitting = ref(false);
const reportError = ref('');
const reportDone = ref(false);
const reviewSubmitting = ref(false);
const reviewError = ref('');
const reviewScore = ref(5);
const selectedReviewTags = ref<string[]>([]);
const reviewAnonymous = ref(false);
const hasReviewed = ref(false);
const reviewCheckedForMatchId = ref('');

const memberReviewScores = ref<Record<string, number>>({});
const memberReviewTags = ref<Record<string, string[]>>({});
const memberReviewSubmitting = ref<Record<string, boolean>>({});
const memberReviewDone = ref<Record<string, boolean>>({});
const memberReviewError = ref<Record<string, string>>({});

// Court label is editable post-creation by the host (see PATCH /matches/:id
// on the API). The page-level draft + busy state lives here so the
// "现场球台" panel can render independent of other forms.
// Member-leave (pending withdraw / approved drop-out). Same endpoint
// covers both — backend dispatches by the application's current status.
const leaving = ref(false);
async function handleLeaveMatch() {
  if (!match.value || leaving.value || isHost.value) return;
  const isApproved = isMember.value;
  const confirmCopy = isApproved
    ? '退出后会释放你的席位，需要重新申请才能再次加入。确定退出吗？'
    : '撤回申请后，主理人就看不到这条申请了。确定撤回吗？';
  const proceed = await modal({
    title: isApproved ? '退出球局' : '撤回申请',
    content: confirmCopy,
    confirmText: isApproved ? '退出' : '撤回',
    cancelText: '再想想',
  });
  if (!proceed.confirm) return;
  leaving.value = true;
  try {
    await leaveMatch(match.value.id);
    applied.value = false;
    myApplicationStatus.value = { status: 'none' };
    toast(isApproved ? '已退出球局' : '已撤回申请', 'success');
    // Re-fetch detail so openSlots + membership state refresh.
    if (match.value?.id) await loadMatch(match.value.id);
    await loadMyApplicationStatus();
    void joinedMatchesQuery.refetch?.();
  } catch {
    toast('操作失败，请稍后再试', 'error');
  } finally {
    leaving.value = false;
  }
}

const courtNameDraft = ref('');
const courtNameSaving = ref(false);
const courtNameError = ref('');
const courtNameToast = ref('');
function currentCourtSuffix() {
  // venueName looks like "<venue> · <courtLabel>" — extract the tail.
  const parts = (match.value?.venueName ?? '').split(' · ');
  return parts.length > 1 ? parts.slice(1).join(' · ') : '';
}
async function saveCourtName() {
  if (!match.value || !isHost.value || courtNameSaving.value) return;
  courtNameError.value = '';
  courtNameToast.value = '';
  courtNameSaving.value = true;
  try {
    const updated = await updateHostedMatch(match.value.id, {
      courtName: courtNameDraft.value.trim(),
    });
    match.value = updated;
    courtNameDraft.value = currentCourtSuffix();
    courtNameToast.value = '球台号已更新';
    toast('球台号已更新', 'success');
  } catch {
    courtNameError.value = '保存失败，请稍后再试';
    toast('保存失败，请稍后再试', 'error');
  } finally {
    courtNameSaving.value = false;
  }
}

const reviewTagOptions = [
  { value: 'on_time', label: '准时到场' },
  { value: 'great_communication', label: '沟通顺畅' },
  { value: 'positive_energy', label: '球场氛围好' },
  { value: 'fair_play', label: '比赛公平' },
];
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
const isCancelled = computed(() => match.value?.status === 'cancelled');
const canReviewHost = computed(() => {
  if (!match.value || !authStore.user?.id || isHost.value) {
    return false;
  }
  if (!isMember.value || !isStarted.value || isCancelled.value) {
    return false;
  }
  return true;
});

const canHostReviewMembers = computed(() => {
  return Boolean(match.value && isHost.value && isStarted.value && !isCancelled.value);
});

const ctaLabel = computed(() => {
  if (submitting.value) {
    return '提交申请中...';
  }

  if (isCancelled.value) {
    return '球局已取消';
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
  if (isCancelled.value) {
    return '主理人已经取消了这场球局，看看广场上有没有其他可以补位的安排。';
  }

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
    isCancelled.value ||
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
    // Pass user coords (if cached) so the backend can compute live distance
    // and stamp venue lat/lng on the response for the map card below.
    const coords = locationStore.coords ?? undefined;
    match.value = await fetchMatchById(id, coords ?? undefined);
    courtNameDraft.value = currentCourtSuffix();
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

  if (isCancelled.value || isStarted.value || isFull.value) {
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
    toast('已申请加入，等待主理人确认', 'success');
  } catch (error) {
    const resp = error as {
      statusCode?: number;
      data?: { message?: string; conflictWith?: { title?: string; roleLabel?: string } };
    };
    const msg = typeof resp.data?.message === 'string' ? resp.data.message : '';
    if (resp.statusCode === 409 && msg === 'match_time_conflict') {
      const c = resp.data?.conflictWith;
      const friendly = c?.title
        ? `这个时间和${c.roleLabel ?? ''}「${c.title}」冲突，无法加入`
        : '这个时间和你已有的球局冲突，无法加入';
      joinError.value = friendly;
      toast(friendly, 'error');
    } else {
      joinError.value = '申请失败，请稍后再试。';
      toast('申请失败，请稍后再试', 'error');
    }
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

function toggleReviewTag(tag: string) {
  const index = selectedReviewTags.value.indexOf(tag);
  if (index >= 0) {
    selectedReviewTags.value.splice(index, 1);
  } else {
    selectedReviewTags.value.push(tag);
  }
}

function setReviewScore(score: number) {
  reviewScore.value = score;
}

async function checkExistingReview() {
  if (!match.value || !authStore.user?.id || !canReviewHost.value) {
    return;
  }
  if (reviewCheckedForMatchId.value === match.value.id) {
    return;
  }

  try {
    const hostId = match.value.hostUserId;
    if (!hostId) {
      return;
    }
    const profile = await fetchReviewProfile(hostId);
    const existing = profile.items.find(
      (item) => item.matchId === match.value?.id && item.reviewerId === authStore.user?.id,
    );
    hasReviewed.value = Boolean(existing);
    reviewCheckedForMatchId.value = match.value.id;
  } catch {
    // best-effort precheck; the API will still 409 on duplicate submit
  }
}

function getMemberScore(userId: string) {
  return memberReviewScores.value[userId] ?? 5;
}

function getMemberTags(userId: string) {
  return memberReviewTags.value[userId] ?? [];
}

function setMemberReviewScore(userId: string, score: number) {
  memberReviewScores.value = { ...memberReviewScores.value, [userId]: score };
}

function toggleMemberReviewTag(userId: string, tag: string) {
  const current = memberReviewTags.value[userId] ?? [];
  const index = current.indexOf(tag);
  const next = index >= 0 ? current.filter((_, i) => i !== index) : [...current, tag];
  memberReviewTags.value = { ...memberReviewTags.value, [userId]: next };
}

async function submitMemberReview(userId: string) {
  if (!match.value || memberReviewSubmitting.value[userId]) {
    return;
  }

  memberReviewSubmitting.value = { ...memberReviewSubmitting.value, [userId]: true };
  memberReviewError.value = { ...memberReviewError.value, [userId]: '' };

  try {
    await submitReview({
      matchId: match.value.id,
      revieweeId: userId,
      score: getMemberScore(userId),
      tags: [...getMemberTags(userId)],
    });
    memberReviewDone.value = { ...memberReviewDone.value, [userId]: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('409')) {
      memberReviewDone.value = { ...memberReviewDone.value, [userId]: true };
      memberReviewError.value = {
        ...memberReviewError.value,
        [userId]: '你已经评价过这位球友，不需要重复评分。',
      };
    } else {
      memberReviewError.value = {
        ...memberReviewError.value,
        [userId]: '评价提交失败，请稍后再试。',
      };
    }
  } finally {
    memberReviewSubmitting.value = { ...memberReviewSubmitting.value, [userId]: false };
  }
}

async function handleSubmitReview() {
  if (!match.value || !match.value.hostUserId || reviewSubmitting.value) {
    return;
  }

  reviewSubmitting.value = true;
  reviewError.value = '';

  try {
    await submitReview({
      matchId: match.value.id,
      revieweeId: match.value.hostUserId,
      score: reviewScore.value,
      tags: [...selectedReviewTags.value],
      anonymous: reviewAnonymous.value,
    });
    hasReviewed.value = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('409')) {
      hasReviewed.value = true;
      reviewError.value = '你已经评价过这位主理人，不需要重复评分。';
    } else {
      reviewError.value = '评价提交失败，请稍后再试。';
    }
  } finally {
    reviewSubmitting.value = false;
  }
}

async function ensureCheckInCode() {
  if (!match.value || !isHost.value) {
    return;
  }

  checkInCodeLoading.value = true;
  checkInCodeError.value = '';

  try {
    const response = await ensureMatchCheckInCode(match.value.id);
    checkInCode.value = response.code;
    await loadCheckIns();
  } catch {
    checkInCodeError.value = '生成签到码失败，请稍后再试。';
  } finally {
    checkInCodeLoading.value = false;
  }
}

async function loadCheckIns() {
  if (!match.value || !isHost.value) {
    return;
  }
  try {
    const response = await fetchMatchCheckIns(match.value.id);
    checkIns.value = response.items;
  } catch {
    // ignore — soft load
  }
}

async function submitMemberCheckIn() {
  if (!match.value || memberCheckInBusy.value) {
    return;
  }

  if (!/^[A-Za-z0-9]{6}$/.test(memberCheckInInput.value.trim())) {
    memberCheckInError.value = '签到码是 6 位数字或字母。';
    return;
  }

  memberCheckInBusy.value = true;
  memberCheckInError.value = '';

  try {
    await submitMatchCheckIn(match.value.id, memberCheckInInput.value.trim().toUpperCase());
    memberCheckedIn.value = true;
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('403')) {
      memberCheckInError.value = '签到码不正确，请向主理人确认。';
    } else {
      memberCheckInError.value = '签到失败，请稍后再试。';
    }
  } finally {
    memberCheckInBusy.value = false;
  }
}

const calendarHint = ref('');

function openVenueNavigation() {
  if (!match.value || match.value.venueLatitude == null || match.value.venueLongitude == null) return;
  const lat = match.value.venueLatitude;
  const lng = match.value.venueLongitude;
  const name = match.value.venueName;
  const address = match.value.venueAddress ?? match.value.venueName;
  // #ifdef MP-WEIXIN
  // Hands off to WeChat's built-in map sheet which offers 高德/腾讯/苹果地图.
  uni.openLocation({ latitude: lat, longitude: lng, name, address, scale: 16 });
  // #endif
  // #ifndef MP-WEIXIN
  // H5: open Tencent Maps' web URL scheme in a new tab. Works on both
  // desktop and mobile browsers; the user can pick "导航" once it loads.
  const url = `https://apis.map.qq.com/uri/v1/marker?marker=coord:${lat},${lng};title:${encodeURIComponent(name)};addr:${encodeURIComponent(address)}&referer=pingpang`;
  if (typeof window !== 'undefined') window.open(url, '_blank');
  // #endif
}

function downloadCalendar() {
  if (!match.value) return;
  calendarHint.value = '';
  const base = resolveApiBaseUrl();
  const url = `${base}/matches/${encodeURIComponent(match.value.id)}/calendar.ics`;
  // #ifdef MP-WEIXIN
  // Mini-programs can't trigger file downloads; we copy the link and tell
  // the user to open it in the browser to get the .ics.
  uni.setClipboardData({
    data: url,
    success: () => {
      uni.showToast({ title: '日历链接已复制，浏览器中打开即可加入', icon: 'none' });
    },
  });
  // #endif
  // #ifndef MP-WEIXIN
  if (typeof window !== 'undefined') {
    // Use an <a download> link so the browser saves the file instead of
    // navigating to it. Filename uses the match id for traceability.
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `pingpang-${match.value.id}.ics`;
    window.document.body.appendChild(a);
    a.click();
    a.remove();
  }
  // #endif
}

function shareMatch() {
  if (!match.value) {
    return;
  }

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/#/pages/match-detail/index?id=${encodeURIComponent(match.value.id)}`;
  const shareTitle = `${match.value.title} · ${match.value.venueName}`;

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    void navigator
      .share({
        title: shareTitle,
        text: `一起来打球吧：${shareTitle}`,
        url: shareUrl,
      })
      .catch(() => undefined);
    return;
  }

  if (typeof uni.setClipboardData === 'function') {
    uni.setClipboardData({
      data: shareUrl,
      success: () => {
        if (typeof uni.showToast === 'function') {
          uni.showToast({ title: '链接已复制，去分享给球友吧', icon: 'none' });
        }
      },
    });
  }
}

function openReport(userId: string, nickname: string) {
  reportTarget.value = { userId, nickname };
  reportReason.value = '';
  reportError.value = '';
  reportDone.value = false;
}

function closeReport() {
  reportTarget.value = null;
}

async function submitReport() {
  if (!reportTarget.value || reportSubmitting.value) {
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
      targetUserId: reportTarget.value.userId,
      reason: trimmed,
      matchId: match.value?.id,
    });
    reportDone.value = true;
  } catch {
    reportError.value = '举报提交失败，请稍后再试。';
  } finally {
    reportSubmitting.value = false;
  }
}

async function handleCancelMatch() {
  if (!match.value || cancelling.value) return;

  // Two-step destructive action. Tell the host exactly how many people
  // will be notified so they don't disband a match by reflex.
  const approved = hostedApplications.value.filter((item) => item.status === 'approved').length;
  const pending = hostedApplications.value.filter((item) => item.status === 'pending').length;
  const affected = approved + pending;
  const lines = [
    `「${match.value.title}」解散后无法恢复。`,
    affected > 0
      ? `${approved} 位已通过的球友 + ${pending} 位申请中的球友会收到系统通知。`
      : '目前还没有球友加入，可以放心解散。',
  ];
  const confirmed = await modal({
    title: '解散这场约球？',
    content: lines.join('\n'),
    confirmText: '确认解散',
    cancelText: '再想想',
    showCancel: true,
  });
  if (!confirmed.confirm) return;

  cancelError.value = '';
  cancelling.value = true;

  try {
    const updated = await cancelHostedMatch(match.value.id);
    match.value = updated;
    hostedApplications.value = hostedApplications.value.map((item) =>
      item.status === 'pending' ? { ...item, status: 'rejected' as const } : item,
    );
    toast('已解散这场约球', 'success');
  } catch (error) {
    // Surface the backend's actual reason so the user knows *why* — most
    // failures here are 409 "match already started" or "already
    // cancelled", both of which the user can resolve by refreshing.
    const resp = error as { statusCode?: number; data?: { message?: string } };
    const status = resp.statusCode ?? 0;
    const serverMessage =
      typeof resp.data?.message === 'string'
        ? resp.data.message
        : Array.isArray(resp.data?.message)
        ? resp.data.message.join('；')
        : '';
    let friendly = '解散失败，请稍后再试';
    if (status === 409 && /already cancelled/i.test(serverMessage)) {
      friendly = '这场球局已经被解散过了，刷新一下页面';
    } else if (status === 409 && /already started/i.test(serverMessage)) {
      friendly = '球局已经开始，无法再解散';
    } else if (status === 403) {
      friendly = '只有主理人能解散这场球局';
    } else if (status === 401) {
      friendly = '登录状态已失效，请重新登录后再试';
    } else if (serverMessage) {
      // Last-resort fallback: show the server message verbatim so we
      // don't silently swallow whatever went wrong in a new edge case.
      friendly = `解散失败：${serverMessage}`;
    }
    cancelError.value = friendly;
    toast(friendly, 'error');
  } finally {
    cancelling.value = false;
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
  canReviewHost,
  (value) => {
    if (value) {
      void checkExistingReview();
    } else {
      hasReviewed.value = false;
      reviewCheckedForMatchId.value = '';
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
      <view class="hero" :class="{ 'hero--has-cover': match.coverUrl }">
        <image v-if="match.coverUrl" :src="match.coverUrl" class="hero-cover" mode="aspectFill" />
        <view class="hero-content">
          <text class="eyebrow">推荐球局</text>
          <text class="title">{{ match.title }}</text>
          <text class="subtitle">{{ match.venueName }} · {{ match.city }}</text>
        </view>
      </view>

      <view class="panel">
        <text class="panel-label">开局时间</text>
        <text class="panel-value">{{ formatStartTime(match.startTime) }}</text>
      </view>

      <view class="panel">
        <text class="panel-label">推荐理由</text>
        <text class="panel-value">
          距离 {{ formatDistance(match.distanceKm) }}，匹配度 {{ match.matchRate }}%，主理人信用 {{ match.hostCreditScore }}
        </text>
      </view>

      <!-- Venue location card. Falls back gracefully when geo isn't on
           the match (legacy data or non-location-aware caller). -->
      <view v-if="match.venueLatitude != null && match.venueLongitude != null" class="panel">
        <text class="panel-label">场馆位置</text>
        <text class="panel-value">{{ match.venueAddress || match.venueName }}</text>
        <view class="venue-map" data-testid="venue-map-card">
          <!-- Native <map> inside mp-weixin renders a real Tencent map
               with the host's lat/lng; H5 builds skip the component so we
               render a "tap to navigate" affordance instead. -->
          <!-- #ifdef MP-WEIXIN -->
          <map
            class="venue-map-canvas"
            :latitude="match.venueLatitude"
            :longitude="match.venueLongitude"
            :markers="[{ id: 1, latitude: match.venueLatitude, longitude: match.venueLongitude, width: 28, height: 36 }]"
            scale="15"
          />
          <!-- #endif -->
          <!-- #ifndef MP-WEIXIN -->
          <view class="venue-map-placeholder">
            <text class="venue-map-pin">📍</text>
            <text class="venue-map-hint">{{ match.venueAddress || match.venueName }}</text>
          </view>
          <!-- #endif -->
        </view>
        <view class="action-row">
          <button class="application-button application-button--ghost" data-testid="open-navigation" @click="openVenueNavigation">
            导航到这里
          </button>
          <button class="application-button application-button--ghost" data-testid="download-ics" @click="downloadCalendar">
            加入日历
          </button>
        </view>
        <text v-if="calendarHint" class="error-copy">{{ calendarHint }}</text>
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

      <view v-if="isHost && !isCancelled" class="panel panel-last">
        <text class="panel-label">现场球台</text>
        <text class="panel-value">到场看到空台后，填上球台号 (例如 "3 号台")，球友会看到最新的位置。</text>
        <view class="check-in-input-row">
          <input
            v-model="courtNameDraft"
            class="check-in-input"
            maxlength="32"
            placeholder="例如 3 号台"
            data-testid="court-name-input"
          />
          <button
            class="application-button application-button--primary"
            data-testid="save-court-name"
            :disabled="courtNameSaving"
            @click="saveCourtName"
          >
            {{ courtNameSaving ? '保存中…' : '保存' }}
          </button>
        </view>
        <text v-if="courtNameError" class="error-copy">{{ courtNameError }}</text>
        <text v-else-if="courtNameToast" class="panel-value">{{ courtNameToast }}</text>
      </view>

      <view v-if="isHost && !isCancelled" class="panel panel-last">
        <text class="panel-label">主理人操作</text>
        <text class="panel-value">人凑不齐、场馆变动或时间冲突时，可以提前解散这场约球。点击后会有二次确认；已加入和申请中的球友都会收到系统通知。</text>
        <view class="action-row">
          <button
            class="application-button application-button--secondary"
            data-testid="cancel-hosted-match"
            :disabled="cancelling"
            @click="handleCancelMatch"
          >
            {{ cancelling ? '解散中…' : '解散约球' }}
          </button>
          <button class="application-button application-button--ghost" data-testid="share-match" @click="shareMatch">
            分享给球友
          </button>
        </view>
        <text v-if="cancelError" class="error-copy">{{ cancelError }}</text>
      </view>

      <view v-if="isHost" class="panel panel-last">
        <text class="panel-label">现场签到</text>
        <text class="panel-value">让到场的球友输入下面的签到码，方便记录出勤和后续打分。</text>
        <view v-if="checkInCode" class="check-in-code-display" data-testid="check-in-code">
          <text class="check-in-code">{{ checkInCode }}</text>
          <button class="application-button application-button--ghost" @click="ensureCheckInCode">刷新</button>
        </view>
        <button
          v-else
          class="application-button application-button--primary"
          data-testid="ensure-check-in-code"
          :disabled="checkInCodeLoading"
          @click="ensureCheckInCode"
        >
          {{ checkInCodeLoading ? '生成中...' : '生成签到码' }}
        </button>
        <text v-if="checkInCodeError" class="error-copy">{{ checkInCodeError }}</text>

        <view v-if="checkIns.length" class="check-in-list">
          <view
            v-for="entry in checkIns.filter((c) => c.role === 'member')"
            :key="entry.userId"
            class="check-in-row"
          >
            <text class="check-in-name">{{ entry.nickname }}</text>
            <text class="check-in-status" :class="{ 'check-in-status--done': entry.checkedInAt }">
              {{ entry.checkedInAt ? '已签到' : '未签到' }}
            </text>
          </view>
        </view>
      </view>

      <view
        v-if="!isHost && (isMember || isPendingApplication) && !isCancelled && !isStarted"
        class="panel panel-last"
      >
        <text class="panel-label">{{ isMember ? '退出球局' : '撤回申请' }}</text>
        <text class="panel-value">
          {{ isMember
            ? '临时有事赶不上？退出会释放席位，主理人会收到系统通知，可以再找球友补位。'
            : '主理人还没确认，可以先撤回这条申请。' }}
        </text>
        <button
          class="application-button application-button--secondary"
          data-testid="leave-match"
          :disabled="leaving"
          @click="handleLeaveMatch"
        >
          {{ leaving ? '处理中…' : isMember ? '退出球局' : '撤回申请' }}
        </button>
      </view>

      <view v-if="!isHost && isMember && !isCancelled" class="panel panel-last">
        <text class="panel-label">现场签到</text>
        <text class="panel-value" v-if="!memberCheckedIn">向主理人要 6 位签到码，到场后输入即可。</text>
        <text class="panel-value" v-else>已签到，本次出勤会计入历史记录。</text>

        <view v-if="!memberCheckedIn" class="check-in-input-row">
          <input
            v-model="memberCheckInInput"
            class="check-in-input"
            maxlength="6"
            placeholder="6 位签到码"
            data-testid="member-check-in-input"
          />
          <button
            class="application-button application-button--primary"
            data-testid="submit-check-in"
            :disabled="memberCheckInBusy"
            @click="submitMemberCheckIn"
          >
            {{ memberCheckInBusy ? '验证中...' : '签到' }}
          </button>
        </view>
        <text v-if="memberCheckInError" class="error-copy">{{ memberCheckInError }}</text>
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

        <view
          v-for="item in approvedApplications"
          :key="item.id"
          class="application-card"
          :data-testid="`approved-member-card-${item.userId}`"
        >
          <text class="application-name">{{ item.applicantNickname }}</text>
          <text class="application-meta">
            {{ item.applicantCity }} · {{ formatLevel(item.applicantLevel) }} · 信用 {{ item.applicantCreditScore }}
          </text>
          <text class="application-status">已同意加入</text>

          <view v-if="canHostReviewMembers" class="member-review">
            <view v-if="memberReviewDone[item.userId]" class="review-confirm review-confirm--inline">
              <text class="review-confirm-title">已完成评价</text>
              <text class="review-confirm-copy">球友信用分已经更新。</text>
            </view>
            <view v-else>
              <text class="member-review-label">评价这位球友</text>
              <view class="review-stars" :data-testid="`member-review-stars-${item.userId}`">
                <button
                  v-for="value in 5"
                  :key="value"
                  type="button"
                  class="review-star review-star--small"
                  :class="{ 'review-star--active': value <= getMemberScore(item.userId) }"
                  :data-testid="`member-review-star-${item.userId}-${value}`"
                  @click="setMemberReviewScore(item.userId, value)"
                >
                  {{ value <= getMemberScore(item.userId) ? '★' : '☆' }}
                </button>
              </view>
              <view class="review-tags">
                <button
                  v-for="tag in reviewTagOptions"
                  :key="tag.value"
                  type="button"
                  class="review-tag"
                  :class="{ 'review-tag--active': getMemberTags(item.userId).includes(tag.value) }"
                  :data-testid="`member-review-tag-${item.userId}-${tag.value}`"
                  @click="toggleMemberReviewTag(item.userId, tag.value)"
                >
                  {{ tag.label }}
                </button>
              </view>
              <text v-if="memberReviewError[item.userId]" class="error-copy">{{ memberReviewError[item.userId] }}</text>
              <button
                type="button"
                class="application-button application-button--primary"
                :data-testid="`submit-member-review-${item.userId}`"
                :disabled="memberReviewSubmitting[item.userId]"
                @click="submitMemberReview(item.userId)"
              >
                {{ memberReviewSubmitting[item.userId] ? '提交中...' : '提交评价' }}
              </button>
            </view>
          </view>
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

      <view v-if="canReviewHost" class="panel panel-last review-panel" data-testid="review-panel">
        <text class="panel-label">球局结束后评价主理人</text>
        <text class="panel-value">为这次约球的体验打个分，你的反馈会影响主理人的信用分。</text>

        <view v-if="hasReviewed" class="review-confirm" data-testid="review-confirm">
          <text class="review-confirm-title">已完成评价</text>
          <text class="review-confirm-copy">感谢你的反馈，主理人的信用分已经更新。</text>
        </view>

        <view v-else>
          <view class="review-stars" data-testid="review-stars">
            <button
              v-for="value in 5"
              :key="value"
              type="button"
              class="review-star"
              :class="{ 'review-star--active': value <= reviewScore }"
              :data-testid="`review-star-${value}`"
              @click="setReviewScore(value)"
            >
              {{ value <= reviewScore ? '★' : '☆' }}
            </button>
          </view>
          <text class="review-score-copy">当前评分：{{ reviewScore }} 分</text>

          <view class="review-tags">
            <button
              v-for="tag in reviewTagOptions"
              :key="tag.value"
              type="button"
              class="review-tag"
              :class="{ 'review-tag--active': selectedReviewTags.includes(tag.value) }"
              :data-testid="`review-tag-${tag.value}`"
              @click="toggleReviewTag(tag.value)"
            >
              {{ tag.label }}
            </button>
          </view>

          <view class="anonymous-row">
            <button
              type="button"
              class="anonymous-toggle"
              :class="{ 'anonymous-toggle--on': reviewAnonymous }"
              data-testid="review-anonymous-toggle"
              @click="reviewAnonymous = !reviewAnonymous"
            >
              {{ reviewAnonymous ? '✓ 匿名提交' : '匿名提交' }}
            </button>
            <text class="anonymous-hint">勾选后主理人个人主页只会看到「匿名球友」</text>
          </view>

          <text v-if="reviewError" class="error-copy">{{ reviewError }}</text>

          <button
            type="button"
            class="application-button application-button--primary"
            data-testid="submit-review"
            :disabled="reviewSubmitting"
            @click="handleSubmitReview"
          >
            {{ reviewSubmitting ? '提交中...' : '提交评价' }}
          </button>
        </view>
      </view>

      <view v-else-if="!isHost" class="cta-bar" data-testid="join-bar">
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

        <view class="cta-actions">
          <button
            type="button"
            class="cta-button"
            data-testid="join-match"
            :disabled="isCtaDisabled"
            @click="handleJoin"
          >
            {{ ctaLabel }}
          </button>
          <view class="cta-secondary-row">
            <button class="cta-secondary" data-testid="share-match-cta" @click="shareMatch">分享</button>
            <button
              v-if="match?.hostUserId"
              class="cta-secondary"
              data-testid="report-host"
              @click="openReport(match.hostUserId, '本场主理人')"
            >
              举报主理人
            </button>
          </view>
        </view>
      </view>
    </template>

    <view v-if="reportTarget" class="modal-mask" data-testid="report-modal">
      <view class="modal-card">
        <text class="modal-title">举报 {{ reportTarget.nickname }}</text>
        <text class="modal-copy" v-if="!reportDone">告诉我们发生了什么，运营会在 24 小时内处理。</text>
        <text class="modal-copy" v-else>已收到你的举报，感谢反馈。</text>

        <textarea
          v-if="!reportDone"
          v-model="reportReason"
          class="modal-textarea"
          maxlength="280"
          data-testid="report-reason"
          placeholder="比如：到场后发现并未约球、言语骚扰..."
        />

        <text v-if="reportError" class="error-copy">{{ reportError }}</text>

        <view class="modal-actions">
          <button class="application-button application-button--ghost" @click="closeReport">
            {{ reportDone ? '关闭' : '取消' }}
          </button>
          <button
            v-if="!reportDone"
            class="application-button application-button--primary"
            data-testid="report-submit"
            :disabled="reportSubmitting"
            @click="submitReport"
          >
            {{ reportSubmitting ? '提交中...' : '提交举报' }}
          </button>
        </view>
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
  /* CTA bar at the bottom is ~200rpx tall + 32rpx bottom offset; leave a
     full screen-worth of breathing room so the last content card never
     gets clipped on shorter viewports. */
  padding-bottom: calc(360rpx + env(safe-area-inset-bottom, 0px));
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
  position: relative;
  overflow: hidden;
  background: linear-gradient(145deg, #0f1c2e 0%, #233954 100%);
}

.hero-cover {
  display: block;
  width: 100%;
  height: 360rpx;
}

.hero--has-cover .hero-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  background: linear-gradient(to top, rgba(10, 20, 35, 0.88) 0%, transparent 100%);
}

.hero-content {
  padding: 32rpx;
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

.venue-map {
  margin-top: 16rpx;
  border-radius: 20rpx;
  overflow: hidden;
  background: #fff8f1;
}
.venue-map-canvas {
  width: 100%;
  height: 320rpx;
}
.venue-map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36rpx 24rpx;
  background: linear-gradient(135deg, #fff3e6, #fffdf9);
  border: 1px dashed rgba(255, 106, 61, 0.32);
  border-radius: 20rpx;
}
.venue-map-pin {
  font-size: 56rpx;
  margin-bottom: 8rpx;
}
.venue-map-hint {
  font-size: 24rpx;
  color: $color-ink;
  text-align: center;
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
  left: 0;
  right: 0;
  bottom: 0;
  /* Full-width bottom bar flush against the viewport edge. Inner
     padding handles content spacing; safe-area-inset-bottom pads the
     home-indicator on iPhone X-style devices. */
  padding: 24rpx 32rpx calc(24rpx + env(safe-area-inset-bottom, 0px));
  background: rgba(255, 253, 249, 0.98);
  border-top: 1rpx solid rgba(15, 28, 46, 0.08);
  box-shadow: 0 -8rpx 24rpx rgba(15, 28, 46, 0.08);
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

.review-panel {
  margin-bottom: 32rpx;
}

.review-stars {
  display: flex;
  gap: 12rpx;
  margin: 18rpx 0 8rpx;
}

.review-star {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  border: 1rpx solid rgba(15, 28, 46, 0.1);
  background: rgba(255, 253, 249, 0.98);
  color: $color-muted;
  font-size: 32rpx;
  font-weight: 800;
  line-height: 64rpx;
  text-align: center;
}

.review-star--active {
  background: rgba(255, 198, 81, 0.22);
  color: #d99500;
  border-color: rgba(217, 149, 0, 0.55);
}

.review-score-copy {
  color: $color-muted;
  font-size: 22rpx;
  margin-bottom: 18rpx;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 18rpx;
}

.review-tag {
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  border: 1rpx solid rgba(15, 28, 46, 0.12);
  background: rgba(255, 253, 249, 0.98);
  color: $color-muted;
  font-size: 22rpx;
  font-weight: 700;
}

.review-tag--active {
  background: rgba(255, 106, 61, 0.12);
  color: $color-primary;
  border-color: rgba(255, 106, 61, 0.55);
}

.review-confirm {
  padding: 24rpx;
  border-radius: 24rpx;
  background: rgba(46, 196, 134, 0.08);
}

.review-confirm-title {
  display: block;
  color: #16864e;
  font-size: 26rpx;
  font-weight: 800;
}

.review-confirm-copy {
  display: block;
  margin-top: 8rpx;
  color: $color-muted;
  font-size: 22rpx;
}

.review-star--small {
  width: 48rpx;
  height: 48rpx;
  font-size: 26rpx;
  line-height: 48rpx;
}

.member-review {
  margin-top: 16rpx;
  padding-top: 16rpx;
  border-top: 1rpx dashed rgba(15, 28, 46, 0.12);
}

.member-review-label {
  display: block;
  color: $color-ink;
  font-size: 22rpx;
  font-weight: 800;
}

.review-confirm--inline {
  padding: 16rpx;
  border-radius: 20rpx;
}

.anonymous-row {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  margin-bottom: 18rpx;
}

.anonymous-toggle {
  align-self: flex-start;
  padding: 10rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.06);
  color: $color-muted;
  font-size: 22rpx;
  font-weight: 700;
}

.anonymous-toggle--on {
  background: rgba(255, 106, 61, 0.14);
  color: $color-primary;
}

.anonymous-hint {
  color: $color-muted;
  font-size: 20rpx;
}

.action-row {
  display: flex;
  gap: 14rpx;
}

.action-row .application-button {
  flex: 1;
}

.check-in-code-display {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-top: 18rpx;
  padding: 18rpx 24rpx;
  border-radius: 24rpx;
  background: rgba(255, 106, 61, 0.12);
}

.check-in-code {
  flex: 1;
  font-size: 56rpx;
  font-weight: 800;
  letter-spacing: 16rpx;
  color: $color-primary;
}

.check-in-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-top: 18rpx;
}

.check-in-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12rpx 16rpx;
  border-radius: 16rpx;
  background: rgba(15, 28, 46, 0.04);
  font-size: 24rpx;
}

.check-in-name {
  color: $color-ink;
  font-weight: 700;
}

.check-in-status {
  color: $color-muted;
  font-size: 22rpx;
  font-weight: 700;
}

.check-in-status--done {
  color: #16864e;
}

.check-in-input-row {
  display: flex;
  gap: 16rpx;
  margin-top: 18rpx;
}

.check-in-input {
  flex: 1;
  border-radius: 24rpx;
  padding: 16rpx 24rpx;
  background: #fff7ef;
  font-size: 30rpx;
  letter-spacing: 6rpx;
  text-align: center;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-top: 16rpx;
}

.cta-secondary-row {
  display: flex;
  gap: 12rpx;
}

.cta-secondary {
  flex: 1;
  min-height: 64rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.06);
  color: $color-muted;
  font-size: 22rpx;
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

.modal-actions .application-button {
  flex: 1;
}
</style>
