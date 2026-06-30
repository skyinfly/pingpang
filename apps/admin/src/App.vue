<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  AdminApplicationRow,
  AdminMatchRow,
  AdminReportRow,
  AdminReviewRow,
  AdminSummary,
  AdminUserRow,
  AdminVenueCourt,
  AdminVenueRow,
  AdminVenueSlot,
  AnalyticsOverview,
  AnalyticsTimeline,
  AnalyticsTopHost,
  AnalyticsTopVenue,
  createAdminApiClient,
  resolveAdminApiBaseUrl,
} from './services/admin-api';
import { DEFAULT_ADMIN_TOKEN, getStoredAdminToken, saveAdminToken } from './services/admin-token';
import EChart from './components/EChart.vue';

type TabKey = 'analytics' | 'applications' | 'matches' | 'users' | 'venues' | 'reviews' | 'reports';
type EditorState = {
  resource: TabKey;
  id?: string;
};
type CourtEditorState = { venueId: string; id?: string };
type SlotEditorState = { venueId: string; id?: string };

const username = ref("");
const password = ref("");
const token = ref(getStoredAdminToken() || DEFAULT_ADMIN_TOKEN);
const activeTab = ref<TabKey>('applications');
const loading = ref(true);
const savingToken = ref(false);
const savingEditor = ref(false);
const savingChild = ref(false);
const decidingApplicationId = ref<string | null>(null);
const errorMessage = ref('');
const summary = ref<AdminSummary | null>(null);
const matches = ref<AdminMatchRow[]>([]);
const users = ref<AdminUserRow[]>([]);
const venues = ref<AdminVenueRow[]>([]);
const applications = ref<AdminApplicationRow[]>([]);
const reviews = ref<AdminReviewRow[]>([]);
const deletingReviewId = ref<string | null>(null);
const reports = ref<AdminReportRow[]>([]);
const resolvingReportId = ref<string | null>(null);
const analyticsOverview = ref<AnalyticsOverview | null>(null);
const matchTimeline = ref<AnalyticsTimeline | null>(null);
const userTimeline = ref<AnalyticsTimeline | null>(null);
const topVenues = ref<AnalyticsTopVenue[]>([]);
const topHosts = ref<AnalyticsTopHost[]>([]);
const analyticsLoading = ref(false);
const analyticsRange = ref(14);
const matchSearch = ref('');
const userSearch = ref('');
const venueSearch = ref('');
const matchTotal = ref(0);
const userTotal = ref(0);
const venueTotal = ref(0);
const applicationTotal = ref(0);
const applicationPage = ref(1);
const matchListLoading = ref(false);
const userListLoading = ref(false);
const venueListLoading = ref(false);

function debouncedReload(
  ref: { value: ReturnType<typeof setTimeout> | null },
  action: () => Promise<void>,
  delay = 300,
) {
  if (ref.value) {
    clearTimeout(ref.value);
  }
  ref.value = setTimeout(() => {
    void action();
  }, delay);
}

const matchSearchTimer: { value: ReturnType<typeof setTimeout> | null } = { value: null };
const userSearchTimer: { value: ReturnType<typeof setTimeout> | null } = { value: null };
const venueSearchTimer: { value: ReturnType<typeof setTimeout> | null } = { value: null };

async function reloadMatches(search = matchSearch.value) {
  matchListLoading.value = true;
  try {
    const response = await api.value.listMatches(search.trim());
    matches.value = response.items;
    matchTotal.value = response.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '球局列表加载失败';
  } finally {
    matchListLoading.value = false;
  }
}

async function reloadUsers(search = userSearch.value) {
  userListLoading.value = true;
  try {
    const response = await api.value.listUsers(search.trim());
    users.value = response.items;
    userTotal.value = response.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '用户列表加载失败';
  } finally {
    userListLoading.value = false;
  }
}

async function reloadVenues(search = venueSearch.value) {
  venueListLoading.value = true;
  try {
    const response = await api.value.listVenues(search.trim());
    venues.value = response.items;
    venueTotal.value = response.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '球馆列表加载失败';
  } finally {
    venueListLoading.value = false;
  }
}

watch(matchSearch, () => debouncedReload(matchSearchTimer, () => reloadMatches()));
watch(userSearch, () => debouncedReload(userSearchTimer, () => reloadUsers()));
watch(venueSearch, () => debouncedReload(venueSearchTimer, () => reloadVenues()));
const editor = ref<EditorState | null>(null);
const form = ref<Record<string, string | number | boolean>>({});
const expandedVenueId = ref<string | null>(null);
const courtEditor = ref<CourtEditorState | null>(null);
const slotEditor = ref<SlotEditorState | null>(null);
const courtForm = ref<{ name: string; sortOrder: number; isActive: boolean }>({
  name: '',
  sortOrder: 0,
  isActive: true,
});
const slotForm = ref<{ label: string; startTime: string; endTime: string; sortOrder: number; isActive: boolean }>({
  label: '',
  startTime: '19:00',
  endTime: '20:30',
  sortOrder: 0,
  isActive: true,
});

const api = computed(() =>
  createAdminApiClient({
    baseUrl: resolveAdminApiBaseUrl(),
    tokenProvider: () => token.value,
  }),
);

const metricCards = computed(() => [
  { label: '用户总数', value: summary.value?.users ?? 0, hint: '已注册球友' },
  { label: '球局总数', value: summary.value?.matches ?? 0, hint: '全部约球记录' },
  { label: '待审核报名', value: summary.value?.pendingApplications ?? 0, hint: '需要主理人处理' },
  { label: '活跃球馆', value: summary.value?.activeVenues ?? 0, hint: '可被用户选择' },
  { label: '未读消息', value: summary.value?.unreadMessages ?? 0, hint: '站内通知与聊天' },
  { label: '评价数量', value: summary.value?.reviews ?? 0, hint: '信用体系样本' },
]);

const selectedMatchVenue = computed<AdminVenueRow | null>(() => {
  const venueId = String(form.value.venueId ?? '');
  return venues.value.find((venue) => venue.id === venueId) ?? null;
});

watch(
  () => form.value.venueId,
  () => {
    if (editor.value?.resource !== 'matches' || editor.value.id) {
      return;
    }

    const venue = selectedMatchVenue.value;
    const courts = venue?.courts.filter((court) => court.isActive) ?? [];
    const slots = venue?.slots.filter((slot) => slot.isActive) ?? [];
    const currentCourt = String(form.value.courtId ?? '');
    const currentSlot = String(form.value.slotId ?? '');

    if (!courts.some((court) => court.id === currentCourt)) {
      form.value.courtId = courts[0]?.id ?? '';
    }

    if (!slots.some((slot) => slot.id === currentSlot)) {
      form.value.slotId = slots[0]?.id ?? '';
    }
  },
);

async function loadDashboard() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const [summaryPayload, matchPayload, userPayload, venuePayload, applicationPayload, reviewPayload, reportPayload] = await Promise.all([
      api.value.getSummary(),
      api.value.listMatches(),
      api.value.listUsers(),
      api.value.listVenues(),
      api.value.listApplications('pending', applicationPage.value),
      api.value.listReviews(),
      api.value.listReports({ status: 'open' }),
    ]);

    summary.value = summaryPayload;
    matches.value = matchPayload.items;
    matchTotal.value = matchPayload.total;
    users.value = userPayload.items;
    userTotal.value = userPayload.total;
    venues.value = venuePayload.items;
    venueTotal.value = venuePayload.total;
    applications.value = applicationPayload.items;
    applicationTotal.value = applicationPayload.total;
    reviews.value = reviewPayload.items;
    reports.value = reportPayload.items;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '后台数据请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}

async function reloadApplications() {
  loading.value = true;
  try {
    const response = await api.value.listApplications('pending', applicationPage.value);
    applications.value = response.items;
    applicationTotal.value = response.total;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '待审列表加载失败';
  } finally {
    loading.value = false;
  }
}

async function approveApplication(applicationId: string) {
  decidingApplicationId.value = applicationId;
  errorMessage.value = '';

  try {
    await api.value.approveApplication(applicationId);
    await reloadApplications();
    const [matchPayload] = await Promise.all([api.value.listMatches(), refreshSummary()]);
    matches.value = matchPayload.items;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '通过申请失败，请稍后再试';
  } finally {
    decidingApplicationId.value = null;
  }
}

async function loadAnalytics(range = analyticsRange.value) {
  analyticsLoading.value = true;
  errorMessage.value = '';

  try {
    const [overview, matches, users, venuesPayload, hostsPayload] = await Promise.all([
      api.value.getAnalyticsOverview(),
      api.value.getMatchTimeline(range),
      api.value.getUserTimeline(range),
      api.value.getTopVenues(5),
      api.value.getTopHosts(5),
    ]);
    analyticsOverview.value = overview;
    matchTimeline.value = matches;
    userTimeline.value = users;
    topVenues.value = venuesPayload.items;
    topHosts.value = hostsPayload.items;
    analyticsRange.value = range;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '看板数据加载失败';
  } finally {
    analyticsLoading.value = false;
  }
}

function changeAnalyticsRange(range: number) {
  void loadAnalytics(range);
}

function timelineMax(timeline: AnalyticsTimeline | null) {
  if (!timeline) return 0;
  return timeline.buckets.reduce((max, bucket) => Math.max(max, bucket.count), 0);
}

function timelineSum(timeline: AnalyticsTimeline | null) {
  if (!timeline) return 0;
  return timeline.buckets.reduce((sum, bucket) => sum + bucket.count, 0);
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDelta(value: number) {
  if (value === 0) return '持平';
  return value > 0 ? `+${value}` : `${value}`;
}

function shortDate(value: string) {
  const [, month, day] = value.split('-');
  return `${Number(month)}/${Number(day)}`;
}

/**
 * Build an ECharts option for a daily-bucket timeline. Single smoothed line
 * with area gradient so a "growth" trend is visually obvious even when the
 * absolute numbers are small (which they often are early in launch).
 */
function timelineLineOption(timeline: AnalyticsTimeline | null, color: string, label: string) {
  const buckets = timeline?.buckets ?? [];
  return {
    grid: { left: 36, right: 16, top: 24, bottom: 32 },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: buckets.map((b) => shortDate(b.date)),
      axisLabel: { color: '#7a8699', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: { color: '#7a8699', fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(15,28,46,0.06)' } },
    },
    series: [
      {
        name: label,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color },
        itemStyle: { color },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${color}55` },
              { offset: 1, color: `${color}00` },
            ],
          },
        },
        data: buckets.map((b) => b.count),
      },
    ],
  } as const;
}

/**
 * Pie chart of pending vs approved vs rejected applications. Sourced from
 * the overview totals so we don't make another round-trip.
 */
function applicationsPieOption(overview: AnalyticsOverview | null) {
  const totals = overview?.totals ?? { applications: 0 };
  const approvalRate = overview?.operations?.approvalRate ?? 0;
  // approval rate is 0..1. Derive approximate buckets — we don't have the
  // raw counts split out, so approve = total * rate, rest is "其他".
  const approved = Math.round(totals.applications * approvalRate);
  const others = Math.max(totals.applications - approved, 0);
  return {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: 0, left: 'center', textStyle: { color: '#4a5670', fontSize: 12 } },
    series: [
      {
        type: 'pie',
        radius: ['58%', '78%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: false },
        data: [
          { name: '已通过', value: approved, itemStyle: { color: '#22c55e' } },
          { name: '待处理 / 拒绝', value: others, itemStyle: { color: '#ff8f57' } },
        ],
      },
    ],
  } as const;
}

async function resolveReport(reportId: string, status: 'reviewed' | 'dismissed') {
  resolvingReportId.value = reportId;
  errorMessage.value = '';

  try {
    await api.value.resolveReport(reportId, status);
    reports.value = reports.value.filter((report) => report.id !== reportId);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '处理举报失败，请稍后再试';
  } finally {
    resolvingReportId.value = null;
  }
}

async function deleteReview(reviewId: string) {
  if (!window.confirm('确认删除这条评价？删除后会回滚被评价用户的信用分变动。')) {
    return;
  }

  deletingReviewId.value = reviewId;
  errorMessage.value = '';

  try {
    await api.value.deleteReview(reviewId);
    reviews.value = reviews.value.filter((review) => review.id !== reviewId);
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '删除评价失败，请稍后再试';
  } finally {
    deletingReviewId.value = null;
  }
}

async function cancelMatch(matchId: string) {
  errorMessage.value = '';

  try {
    const reason = window.prompt('选填：取消原因（留空使用默认文案）') ?? undefined;
    const saved = await api.value.cancelMatch(matchId, reason?.trim() ? reason.trim() : undefined);
    upsertById(matches.value, saved);
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '取消失败，请稍后再试';
  }
}

async function rejectApplication(applicationId: string) {
  decidingApplicationId.value = applicationId;
  errorMessage.value = '';

  try {
    const reason = window.prompt('选填：拒绝原因（留空使用默认文案）') ?? undefined;
    await api.value.rejectApplication(applicationId, reason?.trim() ? reason.trim() : undefined);
    await reloadApplications();
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '拒绝申请失败，请稍后再试';
  } finally {
    decidingApplicationId.value = null;
  }
}

async function refreshSummary() {
  try {
    summary.value = await api.value.getSummary();
  } catch {
    // Keep table edits visible even if the metric refresh fails.
  }
}

async function saveTokenAndReload() {
  savingToken.value = true;
  try {
    const res = await api.value.login({ username: username.value, password: password.value });
    token.value = res.token;
    saveAdminToken(token.value);
    await loadDashboard();
  } catch (e) {
    errorMessage.value = '登录失败，请检查账号密码';
    token.value = '';
    saveAdminToken('');
  } finally {
    savingToken.value = false;
  }
}

function prevApplicationPage() {
  if (applicationPage.value > 1) {
    applicationPage.value--;
    void reloadApplications();
  }
}

function nextApplicationPage() {
  if (applicationPage.value * 20 < applicationTotal.value) {
    applicationPage.value++;
    void reloadApplications();
  }
}

function switchTab(tab: TabKey) {
  activeTab.value = tab;
  editor.value = null;
  form.value = {};
  expandedVenueId.value = null;
  courtEditor.value = null;
  slotEditor.value = null;

  if (tab === 'analytics' && !analyticsOverview.value) {
    void loadAnalytics();
  }
}

watch(activeTab, (tab) => {
  if (tab === 'analytics') void loadAnalytics();
  if (tab === 'applications') void reloadApplications();
});

function openCreate(resource: TabKey) {
  editor.value = { resource };

  if (resource === 'venues') {
    form.value = { name: '', city: '上海', district: '', distanceKm: 0, isActive: true };
    return;
  }

  if (resource === 'users') {
    form.value = { phone: '', nickname: '', city: '上海', level: 'intermediate', creditScore: 100 };
    return;
  }

  const defaultVenue = venues.value.find((venue) => venue.isActive) ?? venues.value[0] ?? null;
  const defaultCourt = defaultVenue?.courts.find((court) => court.isActive) ?? defaultVenue?.courts[0];
  const defaultSlot = defaultVenue?.slots.find((slot) => slot.isActive) ?? defaultVenue?.slots[0];

  form.value = {
    title: '',
    hostUserId: users.value[0]?.id ?? '',
    venueId: defaultVenue?.id ?? '',
    courtId: defaultCourt?.id ?? '',
    slotId: defaultSlot?.id ?? '',
    level: 'intermediate',
    maxPlayers: 4,
  };
}

function openEdit(resource: TabKey, row: AdminMatchRow | AdminUserRow | AdminVenueRow) {
  editor.value = { resource, id: row.id };

  if (resource === 'venues') {
    const venue = row as AdminVenueRow;
    form.value = {
      name: venue.name,
      city: venue.city,
      district: venue.district ?? '',
      distanceKm: venue.distanceKm,
      isActive: venue.isActive,
    };
    return;
  }

  if (resource === 'users') {
    const user = row as AdminUserRow;
    form.value = {
      phone: user.phone,
      nickname: user.nickname,
      city: user.city,
      level: user.level,
      creditScore: user.creditScore,
    };
    return;
  }

  const match = row as AdminMatchRow;
  form.value = {
    title: match.title,
    level: match.level,
    maxPlayers: match.maxPlayers,
  };
}

function closeEditor() {
  editor.value = null;
  form.value = {};
}

function upsertById<T extends { id: string }>(rows: T[], item: T) {
  const index = rows.findIndex((row) => row.id === item.id);

  if (index >= 0) {
    rows.splice(index, 1, item);
    return;
  }

  rows.unshift(item);
}

function stringField(key: string) {
  return String(form.value[key] ?? '').trim();
}

function numberField(key: string) {
  return Number(form.value[key] ?? 0);
}

async function saveEditor() {
  if (!editor.value) {
    return;
  }

  savingEditor.value = true;
  errorMessage.value = '';

  try {
    if (editor.value.resource === 'venues') {
      const payload = {
        name: stringField('name'),
        city: stringField('city'),
        district: stringField('district'),
        distanceKm: numberField('distanceKm'),
        isActive: Boolean(form.value.isActive),
      };
      const saved = editor.value.id
        ? await api.value.updateVenue(editor.value.id, payload)
        : await api.value.createVenue(payload);
      upsertById(venues.value, saved);
    }

    if (editor.value.resource === 'users') {
      const payload = {
        phone: stringField('phone'),
        nickname: stringField('nickname'),
        city: stringField('city'),
        level: stringField('level'),
        creditScore: numberField('creditScore'),
      };
      const saved = editor.value.id
        ? await api.value.updateUser(editor.value.id, payload)
        : await api.value.createUser(payload);
      upsertById(users.value, saved);
    }

    if (editor.value.resource === 'matches') {
      const payload = {
        title: stringField('title'),
        hostUserId: stringField('hostUserId'),
        venueId: stringField('venueId'),
        courtId: stringField('courtId'),
        slotId: stringField('slotId'),
        level: stringField('level'),
        maxPlayers: numberField('maxPlayers'),
      };
      const saved = editor.value.id
        ? await api.value.updateMatch(editor.value.id, {
            title: payload.title,
            level: payload.level,
            maxPlayers: payload.maxPlayers,
          })
        : await api.value.createMatch(payload);
      upsertById(matches.value, saved);
    }

    closeEditor();
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '保存失败，请检查填写内容';
  } finally {
    savingEditor.value = false;
  }
}

async function deleteRow(resource: TabKey, id: string) {
  errorMessage.value = '';

  try {
    if (resource === 'venues') {
      await api.value.deleteVenue(id);
      venues.value = venues.value.filter((item) => item.id !== id);

      if (expandedVenueId.value === id) {
        expandedVenueId.value = null;
      }
    }

    if (resource === 'users') {
      await api.value.deleteUser(id);
      users.value = users.value.filter((item) => item.id !== id);
    }

    if (resource === 'matches') {
      await api.value.deleteMatch(id);
      matches.value = matches.value.filter((item) => item.id !== id);
    }

    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '删除失败，该数据可能仍有关联记录';
  }
}

function toggleVenueExpanded(venueId: string) {
  expandedVenueId.value = expandedVenueId.value === venueId ? null : venueId;
  courtEditor.value = null;
  slotEditor.value = null;
}

function openCourtCreate(venueId: string) {
  courtEditor.value = { venueId };
  courtForm.value = { name: '', sortOrder: 0, isActive: true };
}

function openCourtEdit(venueId: string, court: AdminVenueCourt) {
  courtEditor.value = { venueId, id: court.id };
  courtForm.value = { name: court.name, sortOrder: court.sortOrder, isActive: court.isActive };
}

function closeCourtEditor() {
  courtEditor.value = null;
}

function openSlotCreate(venueId: string) {
  slotEditor.value = { venueId };
  slotForm.value = {
    label: '',
    startTime: '19:00',
    endTime: '20:30',
    sortOrder: 0,
    isActive: true,
  };
}

function openSlotEdit(venueId: string, slot: AdminVenueSlot) {
  slotEditor.value = { venueId, id: slot.id };
  slotForm.value = {
    label: slot.label,
    startTime: formatMinutes(slot.startTime),
    endTime: formatMinutes(slot.endTime),
    sortOrder: slot.sortOrder,
    isActive: slot.isActive,
  };
}

function closeSlotEditor() {
  slotEditor.value = null;
}

async function saveCourt() {
  if (!courtEditor.value) {
    return;
  }

  const { venueId, id } = courtEditor.value;
  savingChild.value = true;
  errorMessage.value = '';

  try {
    const payload = {
      name: courtForm.value.name.trim(),
      sortOrder: Number(courtForm.value.sortOrder) || 0,
      isActive: Boolean(courtForm.value.isActive),
    };
    const saved = id ? await api.value.updateCourt(id, payload) : await api.value.createCourt(venueId, payload);
    upsertById(venues.value, saved);
    courtEditor.value = null;
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '球台保存失败';
  } finally {
    savingChild.value = false;
  }
}

async function deleteCourt(courtId: string) {
  errorMessage.value = '';

  try {
    const saved = await api.value.deleteCourt(courtId);
    upsertById(venues.value, saved);
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '球台仍在被球局引用，无法删除';
  }
}

async function saveSlot() {
  if (!slotEditor.value) {
    return;
  }

  const { venueId, id } = slotEditor.value;
  savingChild.value = true;
  errorMessage.value = '';

  try {
    const payload = {
      label: slotForm.value.label.trim(),
      startTime: slotForm.value.startTime,
      endTime: slotForm.value.endTime,
      sortOrder: Number(slotForm.value.sortOrder) || 0,
      isActive: Boolean(slotForm.value.isActive),
    };
    const saved = id ? await api.value.updateSlot(id, payload) : await api.value.createSlot(venueId, payload);
    upsertById(venues.value, saved);
    slotEditor.value = null;
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '时段保存失败，请检查 HH:MM 格式';
  } finally {
    savingChild.value = false;
  }
}

async function deleteSlot(slotId: string) {
  errorMessage.value = '';

  try {
    const saved = await api.value.deleteSlot(slotId);
    upsertById(venues.value, saved);
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '时段仍在被球局引用，无法删除';
  }
}

function formatMinutes(value: number) {
  const safe = Math.max(0, Math.min(24 * 60 - 1, Math.round(value)));
  const hours = Math.floor(safe / 60);
  const minutes = safe % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

onMounted(() => {
  saveAdminToken(token.value);
  void loadDashboard();
});
</script>

<template>
  <main class="admin-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">运营后台</p>
        <h1>Pingpang 后台管理</h1>
        <p class="hero-copy">集中管理球局、用户和球馆数据，让运营操作真正闭环。</p>
      </div>

      <form class="token-card" @submit.prevent="saveTokenAndReload">
        <div style="margin-bottom: 12px;">
          <label for="admin-username">账号</label>
          <input id="admin-username" v-model="username" type="text" autocomplete="off" class="auth-input" />
        </div>
        <div style="margin-bottom: 12px;">
          <label for="admin-password">密码</label>
          <input id="admin-password" v-model="password" type="password" autocomplete="off" class="auth-input" />
        </div>
        <div class="token-row">
          <button type="submit" :disabled="savingToken" style="width: 100%;">
            {{ savingToken ? '登录中' : '登录' }}
          </button>
        </div>
      </form>
    </section>

    <section v-if="errorMessage" class="state-card error">
      {{ errorMessage }}
    </section>

    <section v-if="loading" class="state-card">
      正在加载后台数据，请稍等...
    </section>

    <template v-else>
      <section class="metrics" aria-label="后台指标">
        <article v-for="card in metricCards" :key="card.label" class="metric-card">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
          <small>{{ card.hint }}</small>
        </article>
      </section>

      <section class="panel">
        <div class="panel-toolbar">
          <div class="tabs" role="tablist" aria-label="后台数据表">
            <button
              data-testid="tab-analytics"
              :class="{ active: activeTab === 'analytics' }"
              type="button"
              @click="switchTab('analytics')"
            >
              数据看板
            </button>
            <button
              data-testid="tab-applications"
              :class="{ active: activeTab === 'applications' }"
              type="button"
              @click="switchTab('applications')"
            >
              待审报名
              <span v-if="applications.length" class="badge">{{ applications.length }}</span>
            </button>
            <button
              data-testid="tab-matches"
              :class="{ active: activeTab === 'matches' }"
              type="button"
              @click="switchTab('matches')"
            >
              球局管理
            </button>
            <button
              data-testid="tab-users"
              :class="{ active: activeTab === 'users' }"
              type="button"
              @click="switchTab('users')"
            >
              用户管理
            </button>
            <button
              data-testid="tab-venues"
              :class="{ active: activeTab === 'venues' }"
              type="button"
              @click="switchTab('venues')"
            >
              球馆管理
            </button>
            <button
              data-testid="tab-reviews"
              :class="{ active: activeTab === 'reviews' }"
              type="button"
              @click="switchTab('reviews')"
            >
              评价审核
            </button>
            <button
              data-testid="tab-reports"
              :class="{ active: activeTab === 'reports' }"
              type="button"
              @click="switchTab('reports')"
            >
              举报处理
              <span v-if="reports.length" class="badge">{{ reports.length }}</span>
            </button>
          </div>

          <button
            v-if="activeTab === 'matches'"
            data-testid="create-matches"
            class="primary-action"
            type="button"
            @click="openCreate('matches')"
          >
            新增球局
          </button>
          <button
            v-if="activeTab === 'users'"
            data-testid="create-users"
            class="primary-action"
            type="button"
            @click="openCreate('users')"
          >
            新增用户
          </button>
          <button
            v-if="activeTab === 'venues'"
            data-testid="create-venues"
            class="primary-action"
            type="button"
            @click="openCreate('venues')"
          >
            新增球馆
          </button>
        </div>

        <form v-if="editor" data-testid="submit-editor" class="editor-card" @submit.prevent="saveEditor">
          <header>
            <h2>{{ editor.id ? '编辑' : '新增' }}{{ editor.resource === 'matches' ? '球局' : editor.resource === 'users' ? '用户' : '球馆' }}</h2>
            <button type="button" @click="closeEditor">取消</button>
          </header>

          <div v-if="editor.resource === 'venues'" class="form-grid">
            <label>球馆名称<input data-testid="venue-name" v-model="form.name" required /></label>
            <label>城市<input data-testid="venue-city" v-model="form.city" required /></label>
            <label>区域<input data-testid="venue-district" v-model="form.district" /></label>
            <label>距离<input data-testid="venue-distance" v-model.number="form.distanceKm" type="number" min="0" step="0.1" /></label>
            <label class="checkbox"><input v-model="form.isActive" type="checkbox" /> 启用球馆</label>
          </div>

          <div v-if="editor.resource === 'users'" class="form-grid">
            <label>手机号<input v-model="form.phone" required /></label>
            <label>昵称<input v-model="form.nickname" required /></label>
            <label>城市<input v-model="form.city" required /></label>
            <label>水平<input v-model="form.level" required /></label>
            <label>信用分<input v-model.number="form.creditScore" type="number" min="0" max="100" /></label>
          </div>

          <div v-if="editor.resource === 'matches'" class="form-grid">
            <label>标题<input v-model="form.title" required /></label>
            <template v-if="!editor.id">
              <label>
                主理人
                <select data-testid="match-host" v-model="form.hostUserId" required>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.nickname }} / {{ user.phone }}
                  </option>
                </select>
              </label>
              <label>
                球馆
                <select data-testid="match-venue" v-model="form.venueId" required>
                  <option v-for="venue in venues" :key="venue.id" :value="venue.id" :disabled="!venue.isActive">
                    {{ venue.name }}{{ venue.isActive ? '' : '（已停用）' }}
                  </option>
                </select>
              </label>
              <label>
                球台
                <select data-testid="match-court" v-model="form.courtId" required :disabled="!selectedMatchVenue">
                  <option value="" disabled>请选择球台</option>
                  <option
                    v-for="court in selectedMatchVenue?.courts ?? []"
                    :key="court.id"
                    :value="court.id"
                    :disabled="!court.isActive"
                  >
                    {{ court.name }}{{ court.isActive ? '' : '（已停用）' }}
                  </option>
                </select>
              </label>
              <label>
                时段
                <select data-testid="match-slot" v-model="form.slotId" required :disabled="!selectedMatchVenue">
                  <option value="" disabled>请选择时段</option>
                  <option
                    v-for="slot in selectedMatchVenue?.slots ?? []"
                    :key="slot.id"
                    :value="slot.id"
                    :disabled="!slot.isActive"
                  >
                    {{ slot.label }} {{ formatMinutes(slot.startTime) }}–{{ formatMinutes(slot.endTime) }}{{ slot.isActive ? '' : '（已停用）' }}
                  </option>
                </select>
              </label>
            </template>
            <label>水平<input v-model="form.level" required /></label>
            <label>人数<input v-model.number="form.maxPlayers" type="number" min="1" /></label>
          </div>

          <button class="primary-action" type="submit" :disabled="savingEditor">
            {{ savingEditor ? '保存中' : '保存' }}
          </button>
        </form>

        <div v-if="activeTab === 'analytics'" class="analytics-wrap">
          <div class="analytics-toolbar">
            <span class="analytics-toolbar-label">时间窗口</span>
            <button
              v-for="range in [7, 14, 30, 60]"
              :key="range"
              type="button"
              class="analytics-range-btn"
              :class="{ active: analyticsRange === range }"
              @click="changeAnalyticsRange(range)"
            >
              近 {{ range }} 天
            </button>
            <span v-if="analyticsLoading" class="analytics-loading">加载中...</span>
          </div>

          <div v-if="analyticsOverview" class="analytics-grid">
            <article class="analytics-card analytics-card--span2">
              <h3>核心指标</h3>
              <div class="kpi-row">
                <div class="kpi">
                  <span>用户总数</span>
                  <strong>{{ analyticsOverview.totals.users }}</strong>
                  <small>{{ analyticsOverview.growth.newUsers30d }} 近 30 天新增</small>
                </div>
                <div class="kpi">
                  <span>球局总数</span>
                  <strong>{{ analyticsOverview.totals.matches }}</strong>
                  <small>{{ analyticsOverview.growth.newMatches30d }} 近 30 天新增</small>
                </div>
                <div class="kpi">
                  <span>累计报名</span>
                  <strong>{{ analyticsOverview.totals.applications }}</strong>
                  <small>{{ formatPercent(analyticsOverview.operations.approvalRate) }} 通过率</small>
                </div>
                <div class="kpi">
                  <span>累计评价</span>
                  <strong>{{ analyticsOverview.totals.reviews }}</strong>
                  <small>{{ analyticsOverview.operations.averageReviewScore.toFixed(2) }} 均分</small>
                </div>
                <div class="kpi">
                  <span>举报队列</span>
                  <strong>{{ analyticsOverview.totals.openReports }}</strong>
                  <small>累计 {{ analyticsOverview.totals.reports }} 条</small>
                </div>
                <div class="kpi">
                  <span>平均信用</span>
                  <strong>{{ analyticsOverview.operations.averageCreditScore.toFixed(1) }}</strong>
                  <small>越高越好</small>
                </div>
              </div>
            </article>

            <article class="analytics-card">
              <h3>7 天新球局</h3>
              <p class="trend">
                <strong>{{ analyticsOverview.growth.newMatches7d }}</strong>
                <em :class="{ up: analyticsOverview.growth.newMatchesDelta > 0, down: analyticsOverview.growth.newMatchesDelta < 0 }">
                  比上 7 天 {{ formatDelta(analyticsOverview.growth.newMatchesDelta) }}
                </em>
              </p>
              <small>30 天内 {{ analyticsOverview.growth.cancelledMatches30d }} 局被取消</small>
            </article>

            <article class="analytics-card">
              <h3>7 天新球友</h3>
              <p class="trend">
                <strong>{{ analyticsOverview.growth.newUsers7d }}</strong>
                <em :class="{ up: analyticsOverview.growth.newUsersDelta > 0, down: analyticsOverview.growth.newUsersDelta < 0 }">
                  比上 7 天 {{ formatDelta(analyticsOverview.growth.newUsersDelta) }}
                </em>
              </p>
              <small>30 天内新增 {{ analyticsOverview.growth.newUsers30d }} 球友</small>
            </article>

            <article class="analytics-card analytics-card--span2">
              <h3>球局趋势（近 {{ matchTimeline?.days ?? 0 }} 天，共 {{ timelineSum(matchTimeline) }} 局）</h3>
              <EChart
                v-if="matchTimeline"
                :option="timelineLineOption(matchTimeline, '#FF6A3D', '球局')"
                :height="220"
                data-testid="chart-matches"
              />
            </article>

            <article class="analytics-card analytics-card--span2">
              <h3>球友新增趋势（近 {{ userTimeline?.days ?? 0 }} 天，共 {{ timelineSum(userTimeline) }} 人）</h3>
              <EChart
                v-if="userTimeline"
                :option="timelineLineOption(userTimeline, '#3B82F6', '新球友')"
                :height="220"
                data-testid="chart-users"
              />
            </article>

            <article class="analytics-card">
              <h3>申请处理结果（累计 {{ analyticsOverview.totals.applications }} 条）</h3>
              <EChart
                :option="applicationsPieOption(analyticsOverview)"
                :height="220"
                data-testid="chart-applications"
              />
            </article>

            <article class="analytics-card">
              <h3>热门球馆 Top 5</h3>
              <ol class="rank-list">
                <li v-for="(venue, index) in topVenues" :key="venue.venueId">
                  <span class="rank-index">{{ index + 1 }}</span>
                  <span class="rank-body">
                    <strong>{{ venue.venueName }}</strong>
                    <small v-if="venue.district">{{ venue.district }}</small>
                  </span>
                  <span class="rank-value">{{ venue.matchCount }} 局</span>
                </li>
                <li v-if="!topVenues.length" class="rank-empty">暂无数据</li>
              </ol>
            </article>

            <article class="analytics-card">
              <h3>活跃主理人 Top 5</h3>
              <ol class="rank-list">
                <li v-for="(host, index) in topHosts" :key="host.hostUserId">
                  <span class="rank-index">{{ index + 1 }}</span>
                  <span class="rank-body">
                    <strong>{{ host.hostNickname }}</strong>
                    <small>信用 {{ host.creditScore }} · {{ host.hostPhone || '—' }}</small>
                  </span>
                  <span class="rank-value">{{ host.hostedMatches }} 局</span>
                </li>
                <li v-if="!topHosts.length" class="rank-empty">暂无数据</li>
              </ol>
            </article>
          </div>

          <div v-else-if="!analyticsLoading" class="empty-row">看板数据未加载，切换到该 tab 时会自动拉取。</div>
        </div>

        <div v-if="activeTab === 'applications'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>申请人</th>
                <th>球局</th>
                <th>主理人</th>
                <th>开始时间</th>
                <th>席位</th>
                <th>申请时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in applications" :key="application.id">
                <td>
                  <strong>{{ application.applicantNickname }}</strong>
                  <small>{{ application.applicantPhone }} · {{ application.applicantCity }} · {{ application.applicantLevel }}</small>
                </td>
                <td>
                  <strong>{{ application.matchTitle }}</strong>
                  <small>{{ application.matchVenueName }}</small>
                </td>
                <td>
                  {{ application.hostNickname }}
                  <small>{{ application.hostPhone }}</small>
                </td>
                <td>{{ formatDateTime(application.matchStartTime) }}</td>
                <td>{{ application.matchMaxPlayers - application.matchOpenSlots }}/{{ application.matchMaxPlayers }}</td>
                <td>{{ formatDateTime(application.createdAt) }}</td>
                <td class="actions">
                  <button
                    type="button"
                    class="primary-action"
                    :data-testid="`approve-${application.id}`"
                    :disabled="decidingApplicationId === application.id || application.matchOpenSlots <= 0"
                    @click="approveApplication(application.id)"
                  >
                    {{ decidingApplicationId === application.id ? '处理中' : '通过' }}
                  </button>
                  <button
                    type="button"
                    :data-testid="`reject-${application.id}`"
                    :disabled="decidingApplicationId === application.id"
                    @click="rejectApplication(application.id)"
                  >
                    拒绝
                  </button>
                </td>
              </tr>
              <tr v-if="!applications.length">
                <td colspan="7" class="empty-row">暂无待处理报名，干得漂亮 ✨</td>
              </tr>
            </tbody>
          </table>
          <div class="pagination" v-if="applicationTotal > 0">
            <button type="button" class="ghost-action" :disabled="applicationPage <= 1" @click="prevApplicationPage">上一页</button>
            <span class="pagination-info">第 {{ applicationPage }} 页 / 共 {{ Math.ceil(applicationTotal / 20) }} 页 (总 {{ applicationTotal }} 条)</span>
            <button type="button" class="ghost-action" :disabled="applicationPage * 20 >= applicationTotal" @click="nextApplicationPage">下一页</button>
          </div>
        </div>

        <div v-if="activeTab === 'matches'" class="table-search">
          <input
            v-model="matchSearch"
            class="search-input"
            data-testid="match-search"
            placeholder="搜索标题 / 球馆 / 主理人手机号..."
          />
          <span class="search-count">
            {{ matchListLoading ? '搜索中...' : `${matches.length} / ${matchTotal}` }}
          </span>
        </div>

        <div v-if="activeTab === 'matches'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>球局</th>
                <th>球馆</th>
                <th>时间</th>
                <th>主理人</th>
                <th>席位</th>
                <th>报名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in matches" :key="match.id">
                <td>
                  <strong>{{ match.title }}</strong>
                  <small>{{ match.city }} / {{ match.level }}</small>
                </td>
                <td>{{ match.venueName }}</td>
                <td>{{ formatDateTime(match.startTime) }}</td>
                <td>
                  {{ match.hostNickname }}
                  <small>{{ match.hostPhone }}</small>
                </td>
                <td>{{ match.maxPlayers - match.openSlots }}/{{ match.maxPlayers }}</td>
                <td>
                  待审 {{ match.applicationCounts.pending }} / 通过 {{ match.applicationCounts.approved }} / 拒绝
                  {{ match.applicationCounts.rejected }}
                  <small v-if="match.status === 'cancelled'" class="cancelled-flag">已取消</small>
                </td>
                <td class="actions">
                  <button type="button" @click="openEdit('matches', match)">编辑</button>
                  <button
                    type="button"
                    :data-testid="`cancel-match-${match.id}`"
                    :disabled="match.status === 'cancelled'"
                    @click="cancelMatch(match.id)"
                  >
                    {{ match.status === 'cancelled' ? '已取消' : '取消球局' }}
                  </button>
                  <button type="button" @click="deleteRow('matches', match.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'users'" class="table-search">
          <input
            v-model="userSearch"
            class="search-input"
            data-testid="user-search"
            placeholder="搜索昵称 / 手机号 / 城市..."
          />
          <span class="search-count">
            {{ userListLoading ? '搜索中...' : `${users.length} / ${userTotal}` }}
          </span>
        </div>

        <div v-if="activeTab === 'users'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>用户</th>
                <th>城市</th>
                <th>水平</th>
                <th>信用分</th>
                <th>发起</th>
                <th>参加</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <strong>{{ user.nickname }}</strong>
                  <small>{{ user.phone }}</small>
                </td>
                <td>{{ user.city }}</td>
                <td>{{ user.level }}</td>
                <td>{{ user.creditScore }}</td>
                <td>{{ user.hostedMatches }}</td>
                <td>{{ user.joinedMatches }}</td>
                <td class="actions">
                  <button type="button" @click="openEdit('users', user)">编辑</button>
                  <button type="button" @click="deleteRow('users', user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'venues'" class="table-search">
          <input
            v-model="venueSearch"
            class="search-input"
            data-testid="venue-search"
            placeholder="搜索球馆名 / 区域..."
          />
          <span class="search-count">
            {{ venueListLoading ? '搜索中...' : `${venues.length} / ${venueTotal}` }}
          </span>
        </div>

        <div v-if="activeTab === 'venues'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>球馆</th>
                <th>区域</th>
                <th>距离</th>
                <th>状态</th>
                <th>球台/时段</th>
                <th>关联球局</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="venue in venues" :key="venue.id">
                <tr>
                  <td>
                    <strong>{{ venue.name }}</strong>
                    <small>{{ venue.city }}</small>
                  </td>
                  <td>{{ venue.district || '未填写' }}</td>
                  <td>{{ venue.distanceKm }}km</td>
                  <td>
                    <span class="status" :class="{ muted: !venue.isActive }">
                      {{ venue.isActive ? '启用中' : '已停用' }}
                    </span>
                  </td>
                  <td>{{ venue.courtCount }} / {{ venue.slotCount }}</td>
                  <td>{{ venue.matchCount }}</td>
                  <td class="actions">
                    <button
                      type="button"
                      :data-testid="`expand-${venue.id}`"
                      @click="toggleVenueExpanded(venue.id)"
                    >
                      {{ expandedVenueId === venue.id ? '收起' : '配置子项' }}
                    </button>
                    <button type="button" @click="openEdit('venues', venue)">编辑</button>
                    <button type="button" @click="deleteRow('venues', venue.id)">删除</button>
                  </td>
                </tr>
                <tr v-if="expandedVenueId === venue.id" class="detail-row">
                  <td colspan="7">
                    <div class="detail-grid">
                      <article class="detail-block">
                        <header>
                          <h3>球台 ({{ venue.courts.length }})</h3>
                          <button
                            type="button"
                            class="ghost-action"
                            :data-testid="`create-court-${venue.id}`"
                            @click="openCourtCreate(venue.id)"
                          >
                            新增球台
                          </button>
                        </header>
                        <form
                          v-if="courtEditor && courtEditor.venueId === venue.id"
                          class="inline-editor"
                          :data-testid="`court-form-${venue.id}`"
                          @submit.prevent="saveCourt"
                        >
                          <label>名称<input v-model="courtForm.name" :data-testid="`court-name-${venue.id}`" required /></label>
                          <label>排序<input v-model.number="courtForm.sortOrder" type="number" /></label>
                          <label class="checkbox">
                            <input v-model="courtForm.isActive" type="checkbox" />
                            启用
                          </label>
                          <div class="inline-editor-actions">
                            <button type="submit" :disabled="savingChild">
                              {{ savingChild ? '保存中' : '保存' }}
                            </button>
                            <button type="button" @click="closeCourtEditor">取消</button>
                          </div>
                        </form>
                        <ul class="child-list">
                          <li v-for="court in venue.courts" :key="court.id">
                            <span>
                              <strong>{{ court.name }}</strong>
                              <small>排序 {{ court.sortOrder }}</small>
                            </span>
                            <span class="status" :class="{ muted: !court.isActive }">
                              {{ court.isActive ? '启用' : '停用' }}
                            </span>
                            <span class="row-actions">
                              <button type="button" @click="openCourtEdit(venue.id, court)">编辑</button>
                              <button type="button" @click="deleteCourt(court.id)">删除</button>
                            </span>
                          </li>
                          <li v-if="!venue.courts.length" class="empty">还没有球台，新增后才能创建球局。</li>
                        </ul>
                      </article>

                      <article class="detail-block">
                        <header>
                          <h3>时段 ({{ venue.slots.length }})</h3>
                          <button
                            type="button"
                            class="ghost-action"
                            :data-testid="`create-slot-${venue.id}`"
                            @click="openSlotCreate(venue.id)"
                          >
                            新增时段
                          </button>
                        </header>
                        <form
                          v-if="slotEditor && slotEditor.venueId === venue.id"
                          class="inline-editor"
                          :data-testid="`slot-form-${venue.id}`"
                          @submit.prevent="saveSlot"
                        >
                          <label>标签<input v-model="slotForm.label" :data-testid="`slot-label-${venue.id}`" required /></label>
                          <label>开始<input v-model="slotForm.startTime" :data-testid="`slot-start-${venue.id}`" placeholder="HH:MM" required /></label>
                          <label>结束<input v-model="slotForm.endTime" :data-testid="`slot-end-${venue.id}`" placeholder="HH:MM" required /></label>
                          <label>排序<input v-model.number="slotForm.sortOrder" type="number" /></label>
                          <label class="checkbox">
                            <input v-model="slotForm.isActive" type="checkbox" />
                            启用
                          </label>
                          <div class="inline-editor-actions">
                            <button type="submit" :disabled="savingChild">
                              {{ savingChild ? '保存中' : '保存' }}
                            </button>
                            <button type="button" @click="closeSlotEditor">取消</button>
                          </div>
                        </form>
                        <ul class="child-list">
                          <li v-for="slot in venue.slots" :key="slot.id">
                            <span>
                              <strong>{{ slot.label }}</strong>
                              <small>{{ formatMinutes(slot.startTime) }}–{{ formatMinutes(slot.endTime) }}</small>
                            </span>
                            <span class="status" :class="{ muted: !slot.isActive }">
                              {{ slot.isActive ? '启用' : '停用' }}
                            </span>
                            <span class="row-actions">
                              <button type="button" @click="openSlotEdit(venue.id, slot)">编辑</button>
                              <button type="button" @click="deleteSlot(slot.id)">删除</button>
                            </span>
                          </li>
                          <li v-if="!venue.slots.length" class="empty">还没有时段，新增后才能创建球局。</li>
                        </ul>
                      </article>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'reviews'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>评分</th>
                <th>被评价人</th>
                <th>评价人</th>
                <th>球局</th>
                <th>标签</th>
                <th>时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="review in reviews" :key="review.id">
                <td>
                  <strong>{{ review.score }} 分</strong>
                  <small v-if="review.score >= 4">正向</small>
                  <small v-else>低评</small>
                </td>
                <td>
                  <strong>{{ review.revieweeNickname }}</strong>
                  <small>{{ review.revieweePhone }} · 信用 {{ review.revieweeCreditScore }}</small>
                </td>
                <td>
                  {{ review.reviewerNickname }}
                  <small>{{ review.reviewerPhone }}</small>
                </td>
                <td>
                  <strong>{{ review.matchTitle }}</strong>
                  <small>{{ review.matchVenueName }}</small>
                </td>
                <td>{{ review.tags.length ? review.tags.join('、') : '无' }}</td>
                <td>{{ formatDateTime(review.createdAt) }}</td>
                <td class="actions">
                  <button
                    type="button"
                    :data-testid="`delete-review-${review.id}`"
                    :disabled="deletingReviewId === review.id"
                    @click="deleteReview(review.id)"
                  >
                    {{ deletingReviewId === review.id ? '处理中' : '删除并回滚' }}
                  </button>
                </td>
              </tr>
              <tr v-if="!reviews.length">
                <td colspan="7" class="empty-row">还没有评价记录，球友评价后会出现在这里。</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'reports'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>状态</th>
                <th>被举报人</th>
                <th>举报人</th>
                <th>球局</th>
                <th>原因</th>
                <th>时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.id">
                <td>
                  <span class="status" :class="{ muted: report.status !== 'open' }">
                    {{
                      report.status === 'open'
                        ? '待处理'
                        : report.status === 'reviewed'
                          ? '已确认'
                          : '已驳回'
                    }}
                  </span>
                </td>
                <td>
                  <strong>{{ report.targetNickname }}</strong>
                  <small>{{ report.targetPhone }}</small>
                </td>
                <td>
                  <strong>{{ report.reporterNickname }}</strong>
                </td>
                <td>{{ report.matchId ?? '无' }}</td>
                <td class="report-reason">{{ report.reason }}</td>
                <td>{{ formatDateTime(report.createdAt) }}</td>
                <td class="actions">
                  <button
                    type="button"
                    class="primary-action"
                    :data-testid="`report-confirm-${report.id}`"
                    :disabled="resolvingReportId === report.id"
                    @click="resolveReport(report.id, 'reviewed')"
                  >
                    {{ resolvingReportId === report.id ? '处理中' : '确认违规' }}
                  </button>
                  <button
                    type="button"
                    :data-testid="`report-dismiss-${report.id}`"
                    :disabled="resolvingReportId === report.id"
                    @click="resolveReport(report.id, 'dismissed')"
                  >
                    驳回
                  </button>
                </td>
              </tr>
              <tr v-if="!reports.length">
                <td colspan="7" class="empty-row">当前没有待处理的举报，运营辛苦了。</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 1080px;
  background:
    radial-gradient(circle at top left, rgba(255, 196, 87, 0.35), transparent 28rem),
    linear-gradient(135deg, #f8f1df 0%, #e7f4ea 48%, #edf1ff 100%);
  color: #17201a;
  font-family: "LXGW WenKai", "Source Han Serif SC", "Microsoft YaHei", sans-serif;
}

button,
input,
select {
  font: inherit;
}

.admin-shell {
  padding: 32px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6b5b2a;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1;
}

.hero-copy {
  max-width: 720px;
  margin: 18px 0 0;
  color: #4a554f;
  font-size: 18px;
  line-height: 1.8;
}

.token-card,
.state-card,
.metric-card,
.panel,
.editor-card {
  border: 1px solid rgba(29, 52, 39, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 80px rgba(48, 62, 53, 0.12);
  backdrop-filter: blur(16px);
}

.token-card,
.editor-card {
  padding: 22px;
}

.token-card label {
  display: block;
  margin-bottom: 12px;
  font-weight: 800;
}

.token-row,
.panel-toolbar,
.tabs,
.actions,
.pagination,
.editor-card header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.token-row input,
.form-grid input,
.form-grid select,
.inline-editor input {
  min-width: 0;
  width: 100%;
  border: 1px solid #ced8cf;
  border-radius: 16px;
  padding: 12px 14px;
  background: #fffdf7;
}

.pagination {
  padding: 20px;
  justify-content: flex-end;
}
.pagination-info {
  font-size: 13px;
  color: #657168;
}

.token-row button,
.tabs button,
.primary-action,
.actions button,
.editor-card header button,
.inline-editor button,
.row-actions button,
.ghost-action {
  border: 0;
  border-radius: 16px;
  padding: 12px 16px;
  background: #183b2a;
  color: white;
  cursor: pointer;
  font-weight: 800;
}

.actions button,
.editor-card header button,
.row-actions button,
.ghost-action {
  background: rgba(24, 59, 42, 0.1);
  color: #183b2a;
}

.token-card p {
  margin: 12px 0 0;
  color: #68756c;
  font-size: 13px;
}

.state-card {
  margin-bottom: 18px;
  padding: 20px;
  color: #4f5b52;
}

.state-card.error {
  border-color: rgba(180, 58, 44, 0.28);
  background: rgba(255, 235, 230, 0.86);
  color: #8e2e22;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.metric-card {
  padding: 20px;
}

.metric-card span,
.metric-card small {
  display: block;
  color: #67736c;
}

.metric-card strong {
  display: block;
  margin: 12px 0 8px;
  font-size: 34px;
}

.panel {
  overflow: hidden;
}

.panel-toolbar {
  justify-content: space-between;
  padding: 18px;
  border-bottom: 1px solid rgba(29, 52, 39, 0.12);
}

.tabs button {
  background: rgba(24, 59, 42, 0.1);
  color: #183b2a;
}

.tabs button.active {
  background: #183b2a;
  color: white;
}

.editor-card {
  margin: 18px;
}

.editor-card header {
  justify-content: space-between;
  margin-bottom: 16px;
}

.editor-card h2 {
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.form-grid label {
  color: #526058;
  font-weight: 800;
}

.form-grid .checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-grid .checkbox input {
  width: auto;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(29, 52, 39, 0.1);
  text-align: left;
  vertical-align: top;
}

th {
  color: #657168;
  font-size: 13px;
  letter-spacing: 0.12em;
}

td strong,
td small {
  display: block;
}

td small {
  margin-top: 4px;
  color: #748078;
}

.status {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 10px;
  background: #dff3dc;
  color: #246332;
  font-weight: 800;
}

.status.muted {
  background: #eeeeee;
  color: #7a7a7a;
}

.detail-row td {
  background: rgba(232, 240, 232, 0.45);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.detail-block {
  border: 1px solid rgba(29, 52, 39, 0.12);
  border-radius: 20px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.75);
}

.detail-block header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.detail-block h3 {
  margin: 0;
  font-size: 18px;
}

.child-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.child-list li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(29, 52, 39, 0.08);
  border-radius: 14px;
  background: #fffdf7;
}

.child-list li.empty {
  display: block;
  text-align: center;
  color: #7a8780;
}

.row-actions {
  display: flex;
  gap: 6px;
}

.inline-editor {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
}

.inline-editor label {
  display: block;
  font-size: 13px;
  font-weight: 800;
  color: #45554c;
}

.inline-editor .checkbox {
  display: flex;
  gap: 6px;
  align-items: center;
}

.inline-editor-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 10px;
}

.ghost-action {
  background: transparent;
  border: 1px solid rgba(24, 59, 42, 0.4);
}

.badge {
  display: inline-block;
  min-width: 22px;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #d04a3a;
  color: white;
  font-size: 12px;
  font-weight: 800;
}

.empty-row {
  padding: 36px 20px;
  text-align: center;
  color: #6f7b73;
}

.cancelled-flag {
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(180, 58, 44, 0.12);
  color: #8e2e22;
  font-weight: 800;
}

.report-reason {
  max-width: 360px;
  word-break: break-word;
  white-space: pre-wrap;
}

.table-search {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 18px;
  border-bottom: 1px solid rgba(29, 52, 39, 0.06);
}

.search-input {
  flex: 1;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid #ced8cf;
  border-radius: 14px;
  background: #fffdf7;
  font-size: 14px;
}

.search-count {
  color: #67736c;
  font-size: 12px;
  font-weight: 800;
}

.analytics-wrap {
  padding: 20px;
}

.analytics-toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.analytics-toolbar-label {
  font-size: 13px;
  font-weight: 800;
  color: #45554c;
}

.analytics-range-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(24, 59, 42, 0.18);
  background: transparent;
  color: #183b2a;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.analytics-range-btn.active {
  background: #183b2a;
  color: white;
  border-color: #183b2a;
}

.analytics-loading {
  margin-left: auto;
  color: #67736c;
  font-size: 13px;
}

.analytics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.analytics-card {
  padding: 18px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(29, 52, 39, 0.1);
  box-shadow: 0 14px 36px rgba(48, 62, 53, 0.08);
}

.analytics-card--span2 {
  grid-column: span 2;
}

.analytics-card h3 {
  margin: 0 0 14px;
  font-size: 18px;
  color: #17201a;
}

.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
  border-radius: 16px;
  background: rgba(15, 28, 46, 0.04);
}

.kpi span {
  color: #67736c;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
}

.kpi strong {
  font-size: 28px;
  color: #17201a;
}

.kpi small {
  color: #67736c;
  font-size: 12px;
}

.trend {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
}

.trend strong {
  font-size: 32px;
  color: #17201a;
}

.trend em {
  font-style: normal;
  font-size: 12px;
  font-weight: 700;
  color: #67736c;
}

.trend em.up {
  color: #16864e;
}

.trend em.down {
  color: #8e2e22;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 160px;
  padding-top: 12px;
  border-bottom: 1px dashed rgba(29, 52, 39, 0.12);
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
  min-width: 0;
}

.chart-bar-fill {
  width: 70%;
  min-height: 2px;
  border-radius: 6px 6px 0 0;
  background: linear-gradient(180deg, #ff8f57 0%, #ff6a3d 100%);
}

.chart-bar-fill--users {
  background: linear-gradient(180deg, #4f86ff 0%, #2d62de 100%);
}

.chart-bar-label {
  margin-top: 6px;
  font-size: 10px;
  color: #67736c;
  white-space: nowrap;
}

.rank-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
}

.rank-list li {
  display: grid;
  grid-template-columns: 24px 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 14px;
  background: #fffdf7;
}

.rank-list li.rank-empty {
  display: block;
  text-align: center;
  color: #67736c;
}

.rank-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(24, 59, 42, 0.1);
  font-size: 12px;
  font-weight: 800;
  color: #183b2a;
}

.rank-body {
  display: flex;
  flex-direction: column;
}

.rank-body strong {
  font-size: 14px;
}

.rank-body small {
  color: #67736c;
  font-size: 12px;
}

.rank-value {
  font-size: 14px;
  font-weight: 800;
  color: #183b2a;
}
</style>

.auth-input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(29, 52, 39, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}
