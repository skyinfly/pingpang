<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMatchesQuery } from '../../composables/useMatchesQuery';
import { formatLevel } from '../../utils/copy';

type TimeFilter = 'all' | 'today' | 'tomorrow' | 'weekend' | 'next7days';

const cityOptions = ['上海'];
const levelOptions = ['beginner', 'intermediate', 'advanced'];
const timeOptions: Array<{ value: TimeFilter; label: string }> = [
  { value: 'all', label: '全部时间' },
  { value: 'today', label: '今晚' },
  { value: 'tomorrow', label: '明天' },
  { value: 'weekend', label: '周末' },
  { value: 'next7days', label: '7 天内' },
];

const selectedCity = ref('上海');
const selectedLevel = ref('intermediate');
const selectedTime = ref<TimeFilter>('all');
const filters = computed(() => ({
  city: selectedCity.value,
  level: selectedLevel.value,
}));

function getRelativeDayLabel(date: Date) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const todayText = formatter.format(now);
  const targetText = formatter.format(date);
  const today = new Date(`${todayText}T00:00:00+08:00`);
  const target = new Date(`${targetText}T00:00:00+08:00`);
  const diffDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
  const [, month, day] = targetText.split('-');

  if (diffDays < 0) {
    return `${Number(month)}月${Number(day)}日`;
  }

  if (diffDays === 0) {
    return '今晚';
  }

  if (diffDays === 1) {
    return '明天';
  }

  return `${Number(month)}月${Number(day)}日`;
}

function formatMatchTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const timeParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Shanghai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const partMap = new Map(timeParts.map((part) => [part.type, part.value]));
  const hours = partMap.get('hour') ?? '00';
  const minutes = partMap.get('minute') ?? '00';

  return `${getRelativeDayLabel(date)} ${hours}:${minutes} 开局`;
}

const matchesQuery = useMatchesQuery(filters);

function getShanghaiDayDiff(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const today = new Date(`${formatter.format(new Date())}T00:00:00+08:00`);
  const target = new Date(`${formatter.format(date)}T00:00:00+08:00`);
  return Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
}

function getShanghaiWeekday(date: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', weekday: 'short' });
  return formatter.format(date);
}

const visibleMatches = computed(() => {
  const items = matchesQuery.data.value?.items ?? [];

  if (selectedTime.value === 'all') {
    return items;
  }

  return items.filter((item) => {
    const date = new Date(item.startTime);
    const diff = getShanghaiDayDiff(date);

    if (selectedTime.value === 'today') {
      return diff === 0;
    }

    if (selectedTime.value === 'tomorrow') {
      return diff === 1;
    }

    if (selectedTime.value === 'weekend') {
      const weekday = getShanghaiWeekday(date);
      return (weekday === 'Sat' || weekday === 'Sun') && diff >= 0 && diff <= 13;
    }

    if (selectedTime.value === 'next7days') {
      return diff >= 0 && diff <= 7;
    }

    return true;
  });
});

function openMatchDetail(id: string) {
  uni.navigateTo({
    url: `/pages/match-detail/index?id=${encodeURIComponent(id)}`,
  });
}
</script>

<template>
  <view class="page">
    <text class="title">约局广场</text>

    <view class="filter-section">
      <text class="filter-label">城市</text>
      <view class="chip-row">
        <button
          v-for="city in cityOptions"
          :key="city"
          class="chip"
          :class="{ 'chip--active': selectedCity === city }"
          :data-filter-city="city"
          @click="selectedCity = city"
        >
          {{ city }}
        </button>
      </view>
    </view>

    <view class="filter-section">
      <text class="filter-label">时间</text>
      <view class="chip-row">
        <button
          v-for="option in timeOptions"
          :key="option.value"
          class="chip"
          :class="{ 'chip--active': selectedTime === option.value }"
          :data-filter-time="option.value"
          @click="selectedTime = option.value"
        >
          {{ option.label }}
        </button>
      </view>
    </view>

    <view class="filter-section">
      <text class="filter-label">水平</text>
      <view class="chip-row">
        <button
          v-for="level in levelOptions"
          :key="level"
          class="chip"
          :class="{ 'chip--active': selectedLevel === level }"
          :data-filter-level="level"
          @click="selectedLevel = level"
        >
          {{ formatLevel(level) }}
        </button>
      </view>
    </view>

    <view v-if="matchesQuery.isLoading.value" class="card">
      <text class="card-title">推荐列表加载中</text>
      <text class="card-subtitle">正在按距离和匹配度排序...</text>
    </view>

    <view
      v-for="item in visibleMatches"
      :key="item.id"
      class="card"
      @click="openMatchDetail(item.id)"
    >
      <view class="card-top">
        <text class="card-title">{{ item.title }}</text>
        <text class="rate">匹配度 {{ item.matchRate }}%</text>
      </view>
      <text class="card-subtitle">
        {{ item.venueName }} · {{ item.distanceKm }}km · 还差 {{ item.openSlots }} 人
      </text>
      <text class="card-meta">
        {{ formatLevel(item.level) }} · {{ formatMatchTime(item.startTime) }} · 推荐分 {{ item.score }}
      </text>
    </view>

    <view v-if="matchesQuery.isError.value" class="card">
      <text class="card-title">推荐刷新失败</text>
      <text class="card-subtitle">请稍后再试。</text>
    </view>

    <view v-if="!matchesQuery.isLoading.value && !matchesQuery.isError.value && visibleMatches.length === 0" class="card">
      <text class="card-title">暂时没有符合条件的球局</text>
      <text class="card-subtitle">换个时间或水平看看，可能会有更合适的场次。</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  background:
    radial-gradient(circle at top right, rgba(255, 163, 102, 0.28), transparent 28%),
    linear-gradient(180deg, #fff6ea 0%, $color-bg 52%, #fffdf9 100%);
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: 800;
  color: $color-ink;
}

.filter-section {
  margin-top: 24rpx;
}

.filter-label {
  display: block;
  margin-bottom: 12rpx;
  color: $color-muted;
  font-size: 22rpx;
  font-weight: 700;
}

.chip-row {
  display: flex;
  gap: 16rpx;
  overflow-x: auto;
}

.chip {
  margin: 0;
  padding: 12rpx 24rpx;
  border-radius: $radius-pill;
  background: rgba(255, 106, 61, 0.08);
  font-size: 24rpx;
  font-weight: 600;
  color: $color-primary;
}

.chip--active {
  background: $color-primary;
  color: #fff;
}

.card {
  margin-top: 20rpx;
  border-radius: $radius-card;
  padding: 28rpx;
  background: $color-surface;
  box-shadow: $shadow-card;
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: $color-ink;
}

.card-subtitle {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.card-meta {
  display: block;
  margin-top: 14rpx;
  font-size: 22rpx;
  color: $color-primary;
}

.rate {
  flex-shrink: 0;
  border-radius: $radius-pill;
  padding: 10rpx 18rpx;
  background: #fff1e8;
  font-size: 22rpx;
  font-weight: 700;
  color: $color-primary;
}
</style>
