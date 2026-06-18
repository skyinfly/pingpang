<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  createMatch,
  fetchMatchOptions,
  searchVenuePois,
  upsertVenueFromPoi,
  type PoiHit,
  type UpsertedVenue,
} from '../../services/api';
import type { MatchOptionPreset } from '../../services/types';
import { useAuthStore } from '../../stores/auth';
import { useLocationStore } from '../../stores/location';
import { useMatchDraftStore } from '../../stores/match-draft';
import { toast } from '../../utils/toast';
import AppToast from '../../components/AppToast.vue';
import AppModal from '../../components/AppModal.vue';

type SelectedVenue = {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string | null;
  distanceMeters: number | null;
};

const authStore = useAuthStore();
const draft = useMatchDraftStore();
const locationStore = useLocationStore();
void locationStore.ensure();

const loading = ref(true);
const loadingError = ref('');
const submitting = ref(false);
const submitError = ref('');

const levelOptions = ref<Array<MatchOptionPreset<string>>>([]);
const playerOptions = ref<Array<MatchOptionPreset<number>>>([]);

const selectedLevelId = ref('intermediate');
const selectedPlayersId = ref('4');

// ---- POI search (now the only venue source) ----------------------------
const poiSearching = ref(false);
const poiResults = ref<PoiHit[]>([]);
const poiKeyword = ref('');
const poiHint = ref('');
const poiExpanded = ref(false);
const PREVIEW_COUNT = 3;
const previewPoiResults = computed(() =>
  poiExpanded.value ? poiResults.value : poiResults.value.slice(0, PREVIEW_COUNT),
);
const hasMorePois = computed(() => poiResults.value.length > PREVIEW_COUNT);

const selectedVenue = ref<SelectedVenue | null>(null);
const venueUpsertingId = ref('');

function formatPoiDistance(meters: number | null) {
  if (meters == null) return '';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

// ---- Date + time pickers ------------------------------------------------
function todayString() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(new Date());
}

function dayLabel(offset: number) {
  const date = new Date(Date.now() + offset * 24 * 60 * 60 * 1000);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const value = formatter.format(date);
  const [, month, day] = value.split('-');
  const weekday = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    weekday: 'short',
  }).format(date);
  let prefix = '';
  if (offset === 0) prefix = '今天 · ';
  else if (offset === 1) prefix = '明天 · ';
  else if (offset === 2) prefix = '后天 · ';
  return { value, display: `${prefix}${Number(month)}/${Number(day)} ${weekday}` };
}

// Full 14-day range still backs the native picker, but the chip row
// only surfaces today/明天/后天 — anything further out lives behind
// the "更多日期" picker so the row doesn't horizontally scroll.
const dateOptions = Array.from({ length: 14 }, (_, index) => dayLabel(index));
const quickDateOptions = dateOptions.slice(0, 3);
// Default both date and time from the same "now + 30min" computation
// so they roll over together. If the rounded-up time crosses midnight
// we bump the date to tomorrow — otherwise the form would submit a
// startTime that's already in the past and `handlePublish` would
// silently refuse to POST.
function defaultDateTime() {
  const now = new Date();
  const minutes = now.getMinutes() < 30 ? 30 : 60;
  const target = new Date(now.getTime() + (minutes - now.getMinutes()) * 60_000);
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai', ...opts }).format(target);
  const date = fmt({ year: 'numeric', month: '2-digit', day: '2-digit' });
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(target);
  return { date, time };
}
const initialDateTime = defaultDateTime();
const selectedDate = ref(initialDateTime.date);

const selectedDateDisplay = computed(() => {
  const hit = dateOptions.find((option) => option.value === selectedDate.value);
  return hit?.display ?? selectedDate.value;
});
const selectedTimeOfDay = ref(initialDateTime.time);
// Common evening / weekend pick-up times. Most matches land in this
// window, so showing them as chips saves the user from spinning the
// picker for a typical case.
const quickTimeOptions = ['18:00', '19:00', '19:30', '20:00', '21:00'] as const;
function chooseTime(value: string) {
  selectedTimeOfDay.value = value;
}

function onPickDate(event: Event | { detail: { value: string } }) {
  // Two shapes: uni-app picker emits { detail: { value } }; native
  // <input type="date"> change fires a DOM Event with a target value.
  const synthetic = event as { detail?: { value?: string } };
  if (synthetic?.detail?.value) {
    selectedDate.value = synthetic.detail.value;
    return;
  }
  const target = (event as Event).target as HTMLInputElement | null;
  if (target?.value) selectedDate.value = target.value;
}
function onPickTime(event: Event | { detail: { value: string } }) {
  const synthetic = event as { detail?: { value?: string } };
  if (synthetic?.detail?.value) {
    selectedTimeOfDay.value = synthetic.detail.value;
    return;
  }
  const target = (event as Event).target as HTMLInputElement | null;
  if (target?.value) selectedTimeOfDay.value = target.value;
}

const selectedLevel = computed(
  () => levelOptions.value.find((item) => item.value === selectedLevelId.value) ?? levelOptions.value[0] ?? null,
);
const selectedPlayers = computed(
  () => playerOptions.value.find((item) => String(item.value) === selectedPlayersId.value) ?? playerOptions.value[0] ?? null,
);

const startTimeIso = computed(() => {
  // Compose ISO string in Asia/Shanghai (+08:00) so the backend gets the
  // wall-clock time the host actually picked, regardless of device locale.
  return `${selectedDate.value}T${selectedTimeOfDay.value}:00+08:00`;
});

const generatedTitle = computed(() => {
  if (!selectedVenue.value) return '请选择球馆';
  return `${selectedVenue.value.name} · ${selectedTimeOfDay.value}约球`;
});

const publishButtonText = computed(() => {
  if (submitting.value) return '正在发布...';
  if (!authStore.token) return '登录后发布';
  return '确认发布球局';
});

const locationBanner = computed(() => {
  if (locationStore.status === 'requesting') return '正在获取你的位置，用来按距离排序球馆…';
  if (locationStore.status === 'denied') return '没有拿到定位权限，请手动输入关键字搜索球馆。';
  if (locationStore.status === 'unavailable') return '当前环境不支持定位，请手动输入关键字搜索球馆。';
  if (locationStore.hasLocation) return '已根据你的位置按"由近到远"排序球馆。';
  return '';
});

function refreshLocation() {
  void locationStore.refresh();
}

async function loadOptions() {
  loading.value = true;
  loadingError.value = '';
  try {
    // Still need level + player presets — venues/timeSlots are now
    // sourced exclusively from the POI panel.
    const coords = locationStore.coords ?? undefined;
    const response = await fetchMatchOptions(coords);
    // Seed scripts have run more than once in some environments which
    // leaves OptionPreset rows duplicated by value. Dedupe defensively
    // so the chip row only shows each level/player count once.
    const dedupe = <T extends { value: string | number }>(items: T[]) => {
      const seen = new Set<string>();
      return items.filter((item) => {
        const key = String(item.value);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    };
    levelOptions.value = dedupe(response.levels);
    playerOptions.value = dedupe(response.playerCounts);
    selectedLevelId.value =
      response.levels.find((l) => l.value === 'intermediate')?.value ?? response.levels[0]?.value ?? '';
    selectedPlayersId.value = String(
      response.playerCounts.find((p) => String(p.value) === '4')?.value ?? response.playerCounts[0]?.value ?? 4,
    );
  } catch {
    loadingError.value = '加载发局选项失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

async function runPoiSearch() {
  const coords = locationStore.coords;
  if (!coords) {
    poiHint.value = '需要先获取你的位置，或手动输入关键字';
    if (!poiKeyword.value.trim()) {
      toast('需要先获取定位再搜索', 'error');
      return;
    }
  }
  if (poiSearching.value) return;
  poiSearching.value = true;
  poiHint.value = '';
  try {
    const response = await searchVenuePois({
      lat: coords?.lat ?? 31.2304,
      lng: coords?.lng ?? 121.4737,
      keyword: poiKeyword.value.trim() || undefined,
      radiusMeters: 8000,
    });
    poiResults.value = response.items;
    if (response.items.length === 0) {
      poiHint.value = '附近没找到球馆，试试别的关键字';
    }
  } catch {
    poiHint.value = '搜索失败，请稍后再试';
  } finally {
    poiSearching.value = false;
  }
}

async function pickPoi(hit: PoiHit) {
  if (venueUpsertingId.value) return;
  venueUpsertingId.value = hit.amapPoiId;
  try {
    const venue: UpsertedVenue = await upsertVenueFromPoi(hit);
    selectedVenue.value = {
      id: venue.id,
      name: venue.name,
      city: venue.city,
      district: venue.district ?? '',
      address: venue.address,
      distanceMeters: hit.distanceMeters,
    };
    toast(`已选 ${venue.name}`, 'success');
  } catch {
    toast('选定球馆失败，请稍后再试', 'error');
  } finally {
    venueUpsertingId.value = '';
  }
}

function clearVenue() {
  selectedVenue.value = null;
}

function syncDraft() {
  draft.patchDraft({
    title: generatedTitle.value,
    venueId: selectedVenue.value?.id ?? '',
    venueName: selectedVenue.value?.name ?? '',
    startTime: selectedTimeOfDay.value,
    city: selectedVenue.value?.city ?? '上海',
    level: selectedLevel.value?.value ?? 'intermediate',
    maxPlayers: selectedPlayers.value?.value ?? 4,
  });
}

function chooseDate(value: string) {
  selectedDate.value = value;
}
function chooseLevel(value: string) {
  selectedLevelId.value = value;
}
function choosePlayers(value: number) {
  selectedPlayersId.value = String(value);
}

watch([selectedVenue, selectedDate, selectedTimeOfDay, selectedLevelId, selectedPlayersId], syncDraft);

function redirectToLogin() {
  uni.navigateTo({
    url: '/pages/login/index?redirect=%2Fpages%2Fcreate-match%2Findex',
  });
}

async function handlePublish() {
  submitError.value = '';
  syncDraft();

  if (!authStore.token) {
    redirectToLogin();
    return;
  }
  if (!selectedVenue.value) {
    submitError.value = '请先选择球馆。';
    return;
  }
  if (!selectedLevel.value || !selectedPlayers.value) {
    submitError.value = '请把水平和人数选完整。';
    return;
  }
  const startMs = new Date(startTimeIso.value).getTime();
  if (Number.isNaN(startMs)) {
    submitError.value = '开局时间无效，请重新选择。';
    return;
  }
  if (startMs <= Date.now()) {
    submitError.value = '开局时间必须晚于当前时间。';
    return;
  }

  submitting.value = true;
  try {
    await createMatch({
      title: generatedTitle.value,
      venueId: selectedVenue.value.id,
      startTime: startTimeIso.value,
      level: selectedLevel.value.value,
      maxPlayers: selectedPlayers.value.value,
    });
    uni.switchTab({ url: '/pages/profile/index' });
  } catch (error) {
    const resp = error as {
      statusCode?: number;
      data?: { message?: string; conflictWith?: { title?: string; roleLabel?: string } };
    };
    const msg = typeof resp.data?.message === 'string' ? resp.data.message : '';
    if (resp.statusCode === 409 && msg === 'match_time_conflict') {
      const c = resp.data?.conflictWith;
      const friendly = c?.title
        ? `这个时间和${c.roleLabel ?? ''}「${c.title}」冲突，请换个时间`
        : '这个时间和你已有的球局冲突，请换个时间';
      submitError.value = friendly;
      toast(friendly, 'error');
    } else {
      submitError.value = '发布失败，请稍后再试。';
      toast('发布失败，请稍后再试', 'error');
    }
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void loadOptions();
});

// As soon as the location store resolves coords, fire the default POI
// search. This is what makes the "附近球馆" list show up on entry without
// the user having to tap a button.
watch(
  () => locationStore.coords,
  (coords) => {
    if (coords && poiResults.value.length === 0 && !poiSearching.value) {
      void runPoiSearch();
    }
  },
  { immediate: true },
);
</script>

<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">快速发局</text>
      <text class="title">发起一场约球</text>
      <text class="subtitle">默认列出你附近的乒乓球馆，挑一个、选好时间，就能发布。</text>
    </view>

    <view v-if="loading" class="state-card">
      <text class="state-title">正在加载发局选项</text>
      <text class="state-copy">水平 / 人数预设加载中…</text>
    </view>

    <view v-else-if="loadingError" class="state-card state-card--error">
      <text class="state-title">发局选项加载失败</text>
      <text class="state-copy">{{ loadingError }}</text>
      <button class="retry-button" @click="loadOptions">重新加载</button>
    </view>

    <view v-else class="panel">
      <text class="panel-title">发布约局</text>
      <text class="panel-copy">球馆按距离排序，时间可自定义；球台可以等到场后再编辑。</text>

      <view v-if="locationBanner" class="location-banner" data-testid="location-banner">
        <text class="location-banner-text">{{ locationBanner }}</text>
        <text
          v-if="locationStore.status === 'denied' || locationStore.status === 'unavailable'"
          class="location-banner-action"
          @click="refreshLocation"
        >
          重新获取
        </text>
      </view>

      <!-- Venue: POI-driven; default list shows top 3 nearest. -->
      <view class="option-block">
        <view class="option-title-row">
          <text class="option-title">球馆</text>
          <text v-if="!poiSearching" class="option-link" @click="runPoiSearch">刷新</text>
          <text v-else class="option-link">搜索中…</text>
        </view>

        <view v-if="selectedVenue" class="selected-venue" data-testid="selected-venue">
          <view class="selected-venue-head">
            <text class="selected-venue-name">{{ selectedVenue.name }}</text>
            <text class="selected-venue-change" @click="clearVenue">更换</text>
          </view>
          <text v-if="selectedVenue.address" class="selected-venue-address">{{ selectedVenue.address }}</text>
        </view>

        <view v-else class="poi-panel">
          <view class="poi-search-row">
            <input
              v-model="poiKeyword"
              class="poi-input"
              type="text"
              maxlength="32"
              placeholder="按球馆名搜索 (留空=附近乒乓球馆)"
              data-testid="poi-input"
              @confirm="runPoiSearch"
            />
            <button
              class="poi-search-button"
              :disabled="poiSearching"
              data-testid="poi-search"
              @click="runPoiSearch"
            >
              {{ poiSearching ? '搜索中…' : '搜索' }}
            </button>
          </view>
          <text v-if="poiHint" class="poi-hint">{{ poiHint }}</text>

          <view v-if="poiSearching && poiResults.length === 0" class="poi-hint">正在查找你附近的球馆…</view>

          <view v-if="previewPoiResults.length > 0" class="poi-list">
            <view
              v-for="hit in previewPoiResults"
              :key="hit.amapPoiId"
              class="poi-card"
              :class="{ 'poi-card--busy': venueUpsertingId === hit.amapPoiId }"
              :data-testid="`poi-result-${hit.amapPoiId}`"
              @click="pickPoi(hit)"
            >
              <view class="poi-card-head">
                <text class="poi-card-name">{{ hit.name }}</text>
                <text v-if="hit.distanceMeters != null" class="poi-card-distance">
                  {{ formatPoiDistance(hit.distanceMeters) }}
                </text>
              </view>
              <text class="poi-card-address">{{ hit.address }}</text>
              <text v-if="venueUpsertingId === hit.amapPoiId" class="poi-card-busy">添加中…</text>
            </view>
          </view>

          <text
            v-if="hasMorePois"
            class="poi-expand"
            data-testid="poi-expand"
            @click="poiExpanded = !poiExpanded"
          >
            {{ poiExpanded ? '收起列表' : `展开全部 (${poiResults.length})` }}
          </text>
        </view>
      </view>

      <view class="option-block">
        <view class="option-title-row">
          <text class="option-title">开局日期</text>
          <!-- Native <input type=date> renders the OS picker on tap; the
               input is overlaid invisibly on top of the label so the
               whole "更多日期" link is the hit area. Works in the
               web-preview shell where uni's <picker> isn't registered. -->
          <label class="picker-link" data-testid="date-picker">
            <text class="option-link">更多日期</text>
            <input
              type="date"
              class="picker-native"
              :value="selectedDate"
              :min="todayString()"
              :max="dateOptions[dateOptions.length - 1].value"
              @change="onPickDate"
            />
          </label>
        </view>
        <view class="date-display">
          <text class="date-value">{{ selectedDateDisplay }}</text>
        </view>
        <view class="option-row">
          <button
            v-for="option in quickDateOptions"
            :key="option.value"
            class="option-chip"
            :class="{ 'option-chip--active': selectedDate === option.value }"
            :data-testid="`date-option-${option.value}`"
            @click="chooseDate(option.value)"
          >
            {{ option.display }}
          </button>
        </view>
      </view>

      <view class="option-block">
        <text class="option-title">开局时间</text>
        <view class="time-card">
          <view class="time-card-head">
            <text class="time-card-value">{{ selectedTimeOfDay }}</text>
            <label class="time-card-custom" data-testid="time-picker">
              <text class="time-card-custom-text">自定义</text>
              <input
                type="time"
                class="picker-native"
                :value="selectedTimeOfDay"
                @change="onPickTime"
              />
            </label>
          </view>
          <view class="time-chip-row">
            <button
              v-for="value in quickTimeOptions"
              :key="value"
              class="time-chip"
              :class="{ 'time-chip--active': selectedTimeOfDay === value }"
              :data-testid="`time-option-${value}`"
              @click="chooseTime(value)"
            >
              {{ value }}
            </button>
          </view>
        </view>
      </view>

      <view class="option-block">
        <text class="option-title">水平</text>
        <view class="option-row">
          <button
            v-for="level in levelOptions"
            :key="level.id"
            class="option-chip"
            :class="{ 'option-chip--active': selectedLevelId === level.value }"
            :data-testid="`level-option-${level.value}`"
            @click="chooseLevel(level.value)"
          >
            {{ level.label }}
          </button>
        </view>
      </view>

      <view class="option-block">
        <text class="option-title">人数</text>
        <view class="option-row">
          <button
            v-for="players in playerOptions"
            :key="players.id"
            class="option-chip"
            :class="{ 'option-chip--active': selectedPlayersId === String(players.value) }"
            :data-testid="`players-option-${players.value}`"
            @click="choosePlayers(players.value)"
          >
            {{ players.label }}
          </button>
        </view>
      </view>

      <view class="summary-card">
        <text class="summary-label">自动生成标题</text>
        <text class="summary-title">{{ generatedTitle }}</text>
        <text class="summary-meta">{{ selectedVenue?.city ?? '上海' }} · {{ selectedVenue?.district ?? '球馆待选' }}</text>
      </view>

      <view class="info-card">
        <text class="info-title">球台到场再定</text>
        <text class="info-copy">先不用选球台号；等到现场看到空台后，主理人可以在球局详情里写上 "X 号台" 通知大家。</text>
      </view>
    </view>

    <view v-if="!loading && !loadingError" class="cta-bar">
      <text class="cta-helper">发布后会生成球局详情，并开放申请加入。</text>
      <text v-if="submitError" class="submit-error">{{ submitError }}</text>
      <button class="publish-button" data-testid="publish-match" :disabled="submitting" @click="handlePublish">
        {{ publishButtonText }}
      </button>
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
  padding-bottom: calc(280rpx + env(safe-area-inset-bottom, 0px));
  background:
    radial-gradient(circle at top right, rgba(255, 106, 61, 0.16), transparent 38%),
    linear-gradient(180deg, #fff4e8 0%, $color-bg 50%, #fffdf8 100%);
}

.hero {
  padding: 36rpx 32rpx;
  border-radius: 32rpx;
  background: linear-gradient(145deg, #0f1c2e 0%, #233954 100%);
  box-shadow: $shadow-card;
}

.eyebrow {
  display: block;
  color: rgba(255, 255, 255, 0.72);
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 3rpx;
}

.title {
  display: block;
  margin-top: 14rpx;
  color: #fff;
  font-size: 46rpx;
  font-weight: 800;
  line-height: 1.2;
}

.subtitle {
  display: block;
  margin-top: 16rpx;
  color: rgba(255, 255, 255, 0.82);
  font-size: 24rpx;
  line-height: 1.6;
}

.panel,
.state-card {
  margin-top: 28rpx;
  padding: 28rpx;
  border-radius: 28rpx;
  background: rgba(255, 253, 249, 0.92);
  box-shadow: $shadow-card;
}

.state-card--error {
  border: 1px solid rgba(209, 67, 47, 0.14);
}

.state-title,
.panel-title {
  display: block;
  font-size: 34rpx;
  font-weight: 800;
  color: $color-ink;
}

.state-copy,
.panel-copy,
.option-title,
.summary-label,
.summary-title,
.summary-meta,
.submit-error,
.info-title,
.info-copy {
  display: block;
}

.state-copy,
.panel-copy {
  margin-top: 12rpx;
  color: $color-muted;
  font-size: 24rpx;
  line-height: 1.6;
}

.retry-button {
  width: 100%;
  margin-top: 20rpx;
  min-height: 84rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
}

.option-block {
  margin-top: 24rpx;
}

.option-title {
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 800;
}

.option-row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 16rpx;
}

.option-row--scroll {
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.option-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.option-link {
  font-size: 24rpx;
  color: $color-primary;
}

/* Native date/time inputs overlaid on top of the link so the entire
   "更多日期"/"选择时间" hit area triggers the OS picker. */
.picker-link {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.picker-native {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
  /* Some browsers ignore opacity on date inputs unless this is set. */
  color: transparent;
}

.location-banner {
  margin-top: 18rpx;
  padding: 16rpx 20rpx;
  border-radius: 18rpx;
  background: rgba(255, 106, 61, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.location-banner-text {
  font-size: 22rpx;
  color: $color-ink;
  flex: 1;
}
.location-banner-action {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 700;
}

/* ---- Selected venue card ---- */
.selected-venue {
  margin-top: 16rpx;
  padding: 18rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 106, 61, 0.08);
  border: 1px solid rgba(255, 106, 61, 0.18);
}
.selected-venue-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.selected-venue-name {
  font-size: 28rpx;
  font-weight: 800;
  color: $color-ink;
}
.selected-venue-change {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 700;
}
.selected-venue-address {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $color-muted;
}

/* ---- POI search panel ---- */
.poi-panel {
  margin: 14rpx 0 18rpx;
  padding: 16rpx;
  border-radius: 20rpx;
  background: rgba(255, 248, 241, 0.9);
  border: 1px solid rgba(255, 106, 61, 0.16);
}
.poi-search-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.poi-input {
  flex: 1;
  height: 72rpx;
  padding: 0 18rpx;
  border-radius: 16rpx;
  background: #ffffff;
  border: 1px solid rgba(15, 28, 46, 0.08);
  font-size: 26rpx;
  color: $color-ink;
  outline: none;
}
.poi-search-button {
  margin: 0;
  padding: 0 24rpx;
  height: 72rpx;
  line-height: 72rpx;
  border-radius: 16rpx;
  background: $color-primary;
  color: #ffffff;
  font-size: 24rpx;
  font-weight: 700;
}
.poi-search-button[disabled] { opacity: 0.6; }
.poi-hint {
  display: block;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $color-muted;
}
.poi-list {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-top: 14rpx;
}
.poi-card {
  padding: 14rpx 18rpx;
  border-radius: 14rpx;
  background: #ffffff;
  border: 1px solid rgba(15, 28, 46, 0.06);
  cursor: pointer;
}
.poi-card--busy { opacity: 0.6; }
.poi-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12rpx;
}
.poi-card-name {
  font-size: 26rpx;
  font-weight: 700;
  color: $color-ink;
}
.poi-card-distance {
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 700;
  flex-shrink: 0;
}
.poi-card-address {
  display: block;
  font-size: 22rpx;
  color: $color-muted;
  margin-top: 4rpx;
  line-height: 1.4;
}
.poi-card-busy {
  display: block;
  font-size: 20rpx;
  color: $color-primary;
  margin-top: 4rpx;
}
.poi-expand {
  display: block;
  text-align: center;
  margin-top: 12rpx;
  font-size: 22rpx;
  color: $color-primary;
  font-weight: 700;
}

.option-chip {
  margin: 0;
  padding: 0 26rpx;
  min-height: 68rpx;
  line-height: 1;
  border-radius: 999rpx;
  background: #ffffff;
  border: 1px solid rgba(15, 28, 46, 0.10);
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease, box-shadow 120ms ease;
}

.option-chip--active {
  background: $color-primary;
  border-color: $color-primary;
  color: #fff;
  box-shadow: 0 6rpx 14rpx rgba(255, 106, 61, 0.32);
}

.date-display {
  margin-top: 14rpx;
  padding: 18rpx 22rpx;
  border-radius: 18rpx;
  background: rgba(15, 28, 46, 0.06);
}
.date-value {
  display: block;
  font-size: 32rpx;
  font-weight: 800;
  color: $color-ink;
}

/* ---- Time card ---- */
.time-card {
  margin-top: 16rpx;
  padding: 24rpx 24rpx 20rpx;
  border-radius: 24rpx;
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.10), rgba(255, 253, 249, 0.96));
  border: 1px solid rgba(255, 106, 61, 0.16);
  box-shadow: 0 6rpx 18rpx rgba(255, 106, 61, 0.08);
}
.time-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
}
.time-card-value {
  font-size: 60rpx;
  font-weight: 800;
  color: $color-ink;
  letter-spacing: 4rpx;
  line-height: 1;
}
.time-card-custom {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: rgba(255, 106, 61, 0.14);
}
.time-card-custom-text {
  font-size: 24rpx;
  font-weight: 700;
  color: $color-primary;
}
.time-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 18rpx;
}
.time-chip {
  margin: 0;
  padding: 10rpx 22rpx;
  min-height: 60rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 106, 61, 0.18);
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}
.time-chip--active {
  background: $color-primary;
  border-color: $color-primary;
  color: #fff;
  box-shadow: 0 6rpx 14rpx rgba(255, 106, 61, 0.32);
}
.time-value {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: $color-ink;
  letter-spacing: 2rpx;
}
.time-hint {
  display: block;
  margin-top: 6rpx;
  font-size: 22rpx;
  color: $color-muted;
}

.summary-card,
.info-card {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
}

.summary-card {
  background: linear-gradient(135deg, rgba(255, 106, 61, 0.12), rgba(255, 253, 249, 0.98));
}

.summary-label,
.info-title {
  color: $color-muted;
  font-size: 22rpx;
}

.summary-title {
  margin-top: 10rpx;
  color: $color-ink;
  font-size: 30rpx;
  font-weight: 800;
  line-height: 1.4;
}

.summary-meta,
.info-copy {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 22rpx;
  line-height: 1.5;
}

.info-card {
  background: linear-gradient(135deg, rgba(15, 28, 46, 0.06), rgba(47, 191, 113, 0.08));
}

.submit-error {
  margin-top: 18rpx;
  color: #d1432f;
  font-size: 24rpx;
  line-height: 1.5;
}

.cta-bar {
  position: fixed;
  right: 24rpx;
  bottom: calc(24rpx + env(safe-area-inset-bottom, 0px));
  left: 24rpx;
  z-index: 20;
  padding: 24rpx;
  border-radius: 28rpx;
  background: rgba(255, 252, 248, 0.98);
  border: 1px solid rgba(255, 106, 61, 0.12);
  box-shadow: 0 18rpx 48rpx rgba(24, 39, 75, 0.14);
}

.cta-helper {
  display: block;
  color: $color-muted;
  font-size: 24rpx;
  line-height: 1.55;
}

.publish-button {
  width: 100%;
  min-height: 92rpx;
  margin-top: 18rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ff6a3d 0%, #ff8f57 100%);
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
  box-shadow: 0 12rpx 28rpx rgba(255, 106, 61, 0.28);
}

.publish-button[disabled] {
  opacity: 0.72;
  box-shadow: none;
}
</style>
