<script setup lang="ts">
import { computed, ref } from 'vue';
import { requestLoginCode, verifyLoginCode } from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const phone = ref('13800138000');
const code = ref('123456');
const hint = ref('开发环境固定验证码为 123456。');
const loading = ref(false);
const tabPaths = new Set(['/pages/home/index', '/pages/square/index', '/pages/messages/index', '/pages/profile/index']);
const hasSession = computed(() => Boolean(authStore.token && authStore.user));

function getRedirectFromLocation() {
  if (typeof window === 'undefined') {
    return '';
  }

  const hash = window.location.hash || '';
  const queryIndex = hash.indexOf('?');

  if (queryIndex === -1) {
    return '';
  }

  const searchParams = new URLSearchParams(hash.slice(queryIndex + 1));
  return searchParams.get('redirect') ?? '';
}

function continueAfterLogin() {
  const redirect = getRedirectFromLocation();

  if (redirect) {
    if (tabPaths.has(redirect)) {
      uni.switchTab({ url: redirect });
      return;
    }

    uni.navigateTo({ url: redirect });
    return;
  }

  uni.switchTab({
    url: '/pages/home/index',
  });
}

async function handleRequestCode() {
  const response = await requestLoginCode(phone.value);
  hint.value = `当前开发验证码：${response.devCode}`;
}

async function handleLogin() {
  loading.value = true;

  try {
    const session = await verifyLoginCode(phone.value, code.value);
    authStore.setSession(session);
    hint.value = `欢迎回来，${session.user.nickname}`;
    continueAfterLogin();
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authStore.clearSession();
  hint.value = '当前账号已退出，你可以重新登录。';
}
</script>

<template>
  <view class="page">
    <view class="card">
      <text class="eyebrow">开发环境登录</text>
      <text class="title">验证码快捷登录</text>
      <text class="subtitle">先获取验证码，再输入固定开发验证码进入应用。</text>

      <view v-if="hasSession" class="session-card">
        <text class="session-title">当前已登录</text>
        <text class="session-copy">{{ authStore.user?.nickname }} · {{ authStore.user?.phone }}</text>
        <button class="secondary-button" data-testid="login-logout-action" @click="handleLogout">退出当前账号</button>
      </view>

      <input v-model="phone" class="input" placeholder="请输入手机号" />
      <input v-model="code" class="input" placeholder="请输入验证码 123456" />

      <button class="ghost-button" @click="handleRequestCode">获取验证码</button>
      <button class="primary-button" :loading="loading" @click="handleLogin">登录并继续</button>

      <text class="hint">{{ hint }}</text>
    </view>
  </view>
</template>

<style scoped lang="scss">
@use '@/theme/tokens.scss' as *;

.page {
  min-height: 100vh;
  padding: 32rpx;
  background: linear-gradient(180deg, #fff3e6 0%, #fff9f1 48%, #fffdf9 100%);
}

.card {
  margin-top: 56rpx;
  border-radius: $radius-card;
  padding: 40rpx 32rpx;
  background: $color-surface;
  box-shadow: $shadow-card;
}

.eyebrow,
.title,
.subtitle,
.session-title,
.session-copy,
.hint {
  display: block;
}

.eyebrow {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  color: $color-primary;
}

.title {
  margin-top: 12rpx;
  font-size: 48rpx;
  font-weight: 800;
  color: $color-ink;
}

.subtitle {
  margin-top: 16rpx;
  font-size: 25rpx;
  line-height: 1.6;
  color: $color-muted;
}

.session-card {
  margin-top: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #fff7ef;
}

.session-title {
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 800;
}

.session-copy {
  margin-top: 10rpx;
  color: $color-muted;
  font-size: 24rpx;
}

.input {
  margin-top: 24rpx;
  border-radius: 24rpx;
  padding: 24rpx;
  background: #fff7ef;
  font-size: 28rpx;
  color: $color-ink;
}

.ghost-button,
.primary-button,
.secondary-button {
  border-radius: 999rpx;
}

.ghost-button {
  margin-top: 24rpx;
  background: #fff1e8;
  color: $color-primary;
}

.primary-button {
  margin-top: 20rpx;
  background: $color-primary;
}

.secondary-button {
  margin-top: 16rpx;
  background: rgba(15, 28, 46, 0.08);
  color: $color-ink;
}

.hint {
  margin-top: 24rpx;
  font-size: 24rpx;
  line-height: 1.5;
  color: $color-muted;
}
</style>
