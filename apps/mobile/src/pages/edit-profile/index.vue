<script setup lang="ts">
import { ref, watch } from 'vue';
import { updateMyProfile, uploadFile } from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const nickname = ref(authStore.user?.nickname ?? '');
const city = ref(authStore.user?.city ?? '');
const level = ref(authStore.user?.level ?? 'intermediate');
const avatarUrl = ref(authStore.user?.avatarUrl ?? '');
const avatarUploading = ref(false);
const submitting = ref(false);
const message = ref('');
const messageKind = ref<'info' | 'error'>('info');

const levelOptions = [
  { value: 'beginner', label: '初级' },
  { value: 'intermediate', label: '中级' },
  { value: 'advanced', label: '高级' },
];

watch(
  () => authStore.user,
  (user) => {
    if (!user) {
      return;
    }
    nickname.value = user.nickname;
    city.value = user.city;
    level.value = user.level;
    avatarUrl.value = user.avatarUrl ?? '';
  },
);

function pickLevel(value: string) {
  level.value = value;
}

function handlePickAvatar() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const filePath = res.tempFilePaths[0];
      if (!filePath) return;
      avatarUploading.value = true;
      message.value = '';
      uploadFile('avatar', filePath)
        .then((result) => {
          avatarUrl.value = result.url;
          return updateMyProfile({ avatarUrl: result.url });
        })
        .then((updated) => {
          authStore.setSession({ token: authStore.token!, user: updated });
          message.value = '头像已更新。';
          messageKind.value = 'info';
        })
        .catch(() => {
          message.value = '头像上传失败，请稍后再试。';
          messageKind.value = 'error';
        })
        .finally(() => {
          avatarUploading.value = false;
        });
    },
  });
}

async function handleSubmit() {
  if (!authStore.token || !authStore.user) {
    message.value = '请先登录后再编辑资料。';
    messageKind.value = 'error';
    return;
  }

  const trimmedNickname = nickname.value.trim();
  const trimmedCity = city.value.trim();

  if (trimmedNickname.length < 1 || trimmedNickname.length > 20) {
    message.value = '昵称长度需要在 1-20 个字符之间。';
    messageKind.value = 'error';
    return;
  }

  if (trimmedCity.length < 1 || trimmedCity.length > 20) {
    message.value = '城市长度需要在 1-20 个字符之间。';
    messageKind.value = 'error';
    return;
  }

  submitting.value = true;
  message.value = '';

  try {
    const updated = await updateMyProfile({
      nickname: trimmedNickname,
      city: trimmedCity,
      level: level.value,
    });
    authStore.setSession({ token: authStore.token, user: updated });
    message.value = '资料已更新。';
    messageKind.value = 'info';
  } catch {
    message.value = '资料更新失败，请稍后再试。';
    messageKind.value = 'error';
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <view class="page">
    <view class="card">
      <text class="title">编辑个人资料</text>
      <text class="subtitle">资料会显示在球友档案、申请记录和评价里。</text>

      <view class="avatar-row" data-testid="avatar-picker" @click="handlePickAvatar">
        <image v-if="avatarUrl" :src="avatarUrl" class="avatar-img" mode="aspectFill" />
        <view v-else class="avatar-placeholder">
          <text class="avatar-placeholder-text">头像</text>
        </view>
        <text class="avatar-label">{{ avatarUploading ? '上传中...' : '点击更换头像' }}</text>
      </view>

      <view class="field">
        <text class="label">昵称</text>
        <input v-model="nickname" class="input" maxlength="20" placeholder="设置你想被叫的名字" data-testid="edit-nickname" />
      </view>

      <view class="field">
        <text class="label">常驻城市</text>
        <input v-model="city" class="input" maxlength="20" placeholder="例如 上海、北京" data-testid="edit-city" />
      </view>

      <view class="field">
        <text class="label">水平</text>
        <view class="chip-row">
          <button
            v-for="option in levelOptions"
            :key="option.value"
            class="chip"
            :class="{ 'chip--active': level === option.value }"
            :data-testid="`edit-level-${option.value}`"
            @click="pickLevel(option.value)"
          >
            {{ option.label }}
          </button>
        </view>
      </view>

      <button class="primary-button" data-testid="edit-submit" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '保存中...' : '保存修改' }}
      </button>

      <text v-if="message" :class="['hint', messageKind === 'error' ? 'hint--error' : '']">
        {{ message }}
      </text>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #fff3e6 0%, $color-bg 45%, #fffdf9 100%);
}

.card {
  border-radius: $radius-card;
  padding: 36rpx 32rpx;
  background: $color-surface;
  box-shadow: $shadow-card;
}

.title {
  font-size: 38rpx;
  font-weight: 800;
  color: $color-ink;
}

.subtitle {
  display: block;
  margin-top: 12rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.avatar-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 28rpx;
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  background: #fff7ef;
}

.avatar-img {
  width: 100rpx;
  height: 100rpx;
  border-radius: 999rpx;
  flex-shrink: 0;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100rpx;
  height: 100rpx;
  border-radius: 999rpx;
  background: rgba(255, 106, 61, 0.16);
  flex-shrink: 0;
}

.avatar-placeholder-text {
  color: $color-primary;
  font-size: 24rpx;
  font-weight: 700;
}

.avatar-label {
  color: $color-muted;
  font-size: 26rpx;
}

.field {
  margin-top: 24rpx;
}

.label {
  display: block;
  margin-bottom: 12rpx;
  font-size: 24rpx;
  font-weight: 700;
  color: $color-muted;
}

.input {
  width: 100%;
  border-radius: 24rpx;
  padding: 22rpx 24rpx;
  background: #fff7ef;
  font-size: 28rpx;
  color: $color-ink;
}

.chip-row {
  display: flex;
  gap: 12rpx;
}

.chip {
  flex: 1;
  padding: 18rpx 0;
  border-radius: 999rpx;
  background: #fff1e8;
  color: $color-primary;
  font-size: 26rpx;
  font-weight: 700;
}

.chip--active {
  background: $color-primary;
  color: #fff;
}

.primary-button {
  margin-top: 28rpx;
  border-radius: 999rpx;
  background: $color-primary;
  color: #fff;
  font-size: 28rpx;
  font-weight: 800;
}

.primary-button[disabled] {
  opacity: 0.6;
}

.hint {
  display: block;
  margin-top: 20rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.hint--error {
  color: #d44a4a;
}
</style>
