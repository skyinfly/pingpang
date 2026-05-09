<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { createMatch, fetchMatchOptions } from '../../services/api';
import type {
  MatchOptionPreset,
  MatchOptionTimeSlot,
  MatchOptionVenue,
  MatchOptionsResponse,
} from '../../services/types';
import { useAuthStore } from '../../stores/auth';
import { useMatchDraftStore } from '../../stores/match-draft';

type CourtOption = MatchOptionVenue['courts'][number];

const authStore = useAuthStore();
const draft = useMatchDraftStore();

const loading = ref(true);
const loadingError = ref('');
const submitting = ref(false);
const submitError = ref('');

const venueOptions = ref<MatchOptionVenue[]>([]);
const timeOptions = ref<MatchOptionTimeSlot[]>([]);
const levelOptions = ref<Array<MatchOptionPreset<string>>>([]);
const playerOptions = ref<Array<MatchOptionPreset<number>>>([]);

const selectedVenueId = ref('');
const selectedCourtId = ref('');
const selectedTimeId = ref('');
const selectedLevelId = ref('');
const selectedPlayersId = ref('');

const selectedVenue = computed(
  () => venueOptions.value.find((item) => item.id === selectedVenueId.value) ?? venueOptions.value[0] ?? null,
);
const availableCourtOptions = computed<CourtOption[]>(() => selectedVenue.value?.courts ?? []);
const selectedCourt = computed(
  () => availableCourtOptions.value.find((item) => item.id === selectedCourtId.value) ?? availableCourtOptions.value[0] ?? null,
);
const availableTimeOptions = computed(() =>
  timeOptions.value.filter((item) => item.venueId === selectedVenueId.value),
);
const selectedTime = computed(
  () => availableTimeOptions.value.find((item) => item.slotId === selectedTimeId.value) ?? availableTimeOptions.value[0] ?? null,
);
const selectedLevel = computed(
  () => levelOptions.value.find((item) => item.value === selectedLevelId.value) ?? levelOptions.value[0] ?? null,
);
const selectedPlayers = computed(
  () => playerOptions.value.find((item) => String(item.value) === selectedPlayersId.value) ?? playerOptions.value[0] ?? null,
);

const generatedTitle = computed(() => {
  if (!selectedVenue.value || !selectedCourt.value || !selectedTime.value) {
    return '请选择球馆、球台和时间';
  }

  return `${selectedVenue.value.name} ${selectedCourt.value.name} · ${selectedTime.value.label}约球`;
});

const publishButtonText = computed(() => {
  if (submitting.value) {
    return '正在发布...';
  }

  if (!authStore.token) {
    return '登录后发布';
  }

  return '确认发布球局';
});

const fieldRows = computed(() => [
  {
    label: '球馆',
    value: selectedVenue.value ? `${selectedVenue.value.name} · ${selectedVenue.value.district}` : '请选择',
  },
  {
    label: '球台',
    value: selectedCourt.value?.name ?? '请选择',
  },
  {
    label: '开局时间',
    value: selectedTime.value ? `${selectedTime.value.label} ${selectedTime.value.startTime}-${selectedTime.value.endTime}` : '请选择',
  },
  {
    label: '水平',
    value: selectedLevel.value?.label ?? '请选择',
  },
  {
    label: '人数',
    value: selectedPlayers.value?.label ?? '请选择',
  },
]);

function pickDefaultOption<T>(
  items: T[],
  preferred: string,
  accessor: (item: T) => string,
) {
  return items.find((item) => accessor(item) === preferred) ?? items[0] ?? null;
}

function syncDraft() {
  draft.patchDraft({
    title: generatedTitle.value,
    venueId: selectedVenue.value?.id ?? '',
    courtId: selectedCourt.value?.id ?? '',
    slotId: selectedTime.value?.slotId ?? '',
    venueName: selectedVenue.value && selectedCourt.value ? `${selectedVenue.value.name} ${selectedCourt.value.name}` : '',
    startTime: selectedTime.value?.startTime ?? '',
    city: selectedVenue.value?.city ?? '上海',
    level: selectedLevel.value?.value ?? 'intermediate',
    maxPlayers: selectedPlayers.value?.value ?? 4,
  });
}

function initializeSelections(options: MatchOptionsResponse) {
  const defaultVenue = options.venues[0] ?? null;
  const defaultCourt = defaultVenue?.courts[0] ?? null;
  const defaultLevel = pickDefaultOption(options.levels, 'intermediate', (item) => item.value);
  const defaultPlayers = pickDefaultOption(options.playerCounts, '4', (item) => String(item.value));
  const venueId = defaultVenue?.id ?? '';
  const venueSlots = options.timeSlots.filter((item) => item.venueId === venueId);
  const defaultTime = venueSlots[0] ?? null;

  selectedVenueId.value = venueId;
  selectedCourtId.value = defaultCourt?.id ?? '';
  selectedTimeId.value = defaultTime?.slotId ?? '';
  selectedLevelId.value = defaultLevel?.value ?? '';
  selectedPlayersId.value = defaultPlayers ? String(defaultPlayers.value) : '';
  syncDraft();
}

async function loadOptions() {
  loading.value = true;
  loadingError.value = '';

  try {
    const response = await fetchMatchOptions();
    venueOptions.value = response.venues;
    timeOptions.value = response.timeSlots;
    levelOptions.value = response.levels;
    playerOptions.value = response.playerCounts;
    initializeSelections(response);
  } catch {
    loadingError.value = '加载发局选项失败，请稍后再试。';
  } finally {
    loading.value = false;
  }
}

function chooseVenue(id: string) {
  const currentSlotBelongsToVenue = timeOptions.value.some(
    (item) => item.slotId === selectedTimeId.value && item.venueId === id,
  );

  selectedVenueId.value = id;
  selectedCourtId.value = venueOptions.value.find((item) => item.id === id)?.courts[0]?.id ?? '';

  if (!currentSlotBelongsToVenue) {
    selectedTimeId.value = timeOptions.value.find((item) => item.venueId === id)?.slotId ?? '';
  }

  syncDraft();
}

function chooseCourt(id: string) {
  selectedCourtId.value = id;
  syncDraft();
}

function chooseTime(slotId: string) {
  selectedTimeId.value = slotId;
  syncDraft();
}

function chooseLevel(value: string) {
  selectedLevelId.value = value;
  syncDraft();
}

function choosePlayers(value: number) {
  selectedPlayersId.value = String(value);
  syncDraft();
}

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

  if (!selectedVenue.value || !selectedCourt.value || !selectedTime.value || !selectedLevel.value || !selectedPlayers.value) {
    submitError.value = '请先把球馆、球台、时间、水平和人数选完整。';
    return;
  }

  submitting.value = true;

  try {
    await createMatch({
      title: generatedTitle.value,
      venueId: selectedVenue.value.id,
      courtId: selectedCourt.value.id,
      slotId: selectedTime.value.slotId,
      level: selectedLevel.value.value,
      maxPlayers: selectedPlayers.value.value,
    });

    uni.switchTab({
      url: '/pages/profile/index',
    });
  } catch {
    submitError.value = '发布失败，请稍后再试。';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  void loadOptions();
});
</script>

<template>
  <view class="page">
    <view class="hero">
      <text class="eyebrow">快速发局</text>
      <text class="title">一键发起今晚能成的球局</text>
      <text class="subtitle">球馆、球台、时段、水平和人数都会从数据库实时加载，选好就能直接发布。</text>
    </view>

    <view v-if="loading" class="state-card">
      <text class="state-title">正在加载发局选项</text>
      <text class="state-copy">我们正在同步球馆、球台、时段和人数配置，请稍等一下。</text>
    </view>

    <view v-else-if="loadingError" class="state-card state-card--error">
      <text class="state-title">发局选项暂时没加载出来</text>
      <text class="state-copy">{{ loadingError }}</text>
      <button class="retry-button" @click="loadOptions">重新加载</button>
    </view>

    <view v-else class="panel">
      <text class="panel-title">发布约局</text>
      <text class="panel-copy">先把基础条件选好，系统会按照当前场馆、球台和时段生成球局标题。</text>

      <view class="option-block">
        <text class="option-title">球馆</text>
        <view class="option-row">
          <button
            v-for="venue in venueOptions"
            :key="venue.id"
            class="option-chip"
            :class="{ 'option-chip--active': selectedVenueId === venue.id }"
            :data-testid="`venue-option-${venue.id}`"
            @click="chooseVenue(venue.id)"
          >
            {{ venue.name }}
          </button>
        </view>
      </view>

      <view class="option-block">
        <text class="option-title">球台</text>
        <view class="option-row">
          <button
            v-for="court in availableCourtOptions"
            :key="court.id"
            class="option-chip"
            :class="{ 'option-chip--active': selectedCourtId === court.id }"
            :data-testid="`court-option-${court.id}`"
            @click="chooseCourt(court.id)"
          >
            {{ court.name }}
          </button>
        </view>
      </view>

      <view class="option-block">
        <text class="option-title">开局时间</text>
        <view class="option-row">
          <button
            v-for="time in availableTimeOptions"
            :key="time.slotId"
            class="option-chip"
            :class="{ 'option-chip--active': selectedTimeId === time.slotId }"
            :data-testid="`time-option-${time.slotId}`"
            @click="chooseTime(time.slotId)"
          >
            {{ time.label }} {{ time.startTime }}
          </button>
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
        <text class="summary-meta">
          {{ selectedVenue?.city ?? '上海' }} · {{ selectedVenue?.district ?? '球馆待选' }} ·
          {{ selectedTime?.label ?? '时间待选' }}
        </text>
      </view>

      <view v-for="item in fieldRows" :key="item.label" class="field-row">
        <text class="field-label">{{ item.label }}</text>
        <text class="field-value">{{ item.value }}</text>
      </view>

      <view class="info-card">
        <text class="info-title">真实数据来源</text>
        <text class="info-copy">当前展示的球馆、球台、时间档、水平和人数都来自数据库配置，发布后会直接生成真实球局。</text>
      </view>
    </view>

    <view v-if="!loading && !loadingError" class="cta-bar">
      <text class="cta-helper">发布后会生成球局详情，并开放申请加入。</text>
      <text v-if="submitError" class="submit-error">{{ submitError }}</text>
      <button class="publish-button" data-testid="publish-match" :disabled="submitting" @click="handlePublish">
        {{ publishButtonText }}
      </button>
    </view>
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

.option-chip {
  margin: 0;
  padding: 0 24rpx;
  min-height: 76rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
  font-size: 24rpx;
  font-weight: 700;
}

.option-chip--active {
  background: $color-primary;
  color: #fff;
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

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 22rpx;
  padding-bottom: 18rpx;
  border-bottom: 1rpx solid rgba(15, 28, 46, 0.08);
}

.field-label {
  color: $color-muted;
  font-size: 24rpx;
}

.field-value {
  max-width: 420rpx;
  text-align: right;
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
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
