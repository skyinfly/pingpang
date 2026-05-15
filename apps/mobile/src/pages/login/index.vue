<script setup lang="ts">
import { computed, ref } from 'vue';
import { loginWithWechat, requestLoginCode, verifyLoginCode } from '../../services/api';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const phone = ref('');
const code = ref('');
const hint = ref('');
const codeSent = ref(false);
const requesting = ref(false);
const loading = ref(false);
const wechatLoading = ref(false);
const tabPaths = new Set(['/pages/home/index', '/pages/square/index', '/pages/messages/index', '/pages/profile/index']);
const hasSession = computed(() => Boolean(authStore.token && authStore.user));

// `wx.login` is only available inside the WeChat mini-program runtime;
// guard so the H5 build does not show a button that cannot work.
const wechatLoginAvailable = computed(() => {
  if (typeof uni === 'undefined' || !('login' in uni)) {
    return false;
  }
  const globalWx = (globalThis as { wx?: { login?: unknown } }).wx;
  return Boolean(globalWx && typeof globalWx.login === 'function');
});

const phoneValid = computed(() => /^1\d{10}$/.test(phone.value));
const codeValid = computed(() => /^\d{6}$/.test(code.value));

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
  if (!phoneValid.value || requesting.value) {
    hint.value = '请输入有效的 11 位手机号';
    return;
  }

  requesting.value = true;

  try {
    const response = await requestLoginCode(phone.value);

    if (response.devCode) {
      hint.value = `验证码已发送（开发环境直接显示：${response.devCode}）`;
      code.value = response.devCode;
    } else {
      hint.value = '验证码已发送到你的手机，5 分钟内有效。';
    }

    codeSent.value = true;
  } catch {
    hint.value = '验证码发送失败，请稍后再试或检查网络。';
  } finally {
    requesting.value = false;
  }
}

async function handleLogin() {
  if (!phoneValid.value) {
    hint.value = '请输入有效的 11 位手机号';
    return;
  }

  if (!codeValid.value) {
    hint.value = '请输入 6 位验证码';
    return;
  }

  loading.value = true;

  try {
    const session = await verifyLoginCode(phone.value, code.value);
    authStore.setSession(session);
    hint.value = `欢迎回来，${session.user.nickname}`;
    continueAfterLogin();
  } catch {
    hint.value = '验证码不正确或已过期，请重新获取。';
  } finally {
    loading.value = false;
  }
}

function handleLogout() {
  authStore.clearSession();
  hint.value = '当前账号已退出，你可以重新登录。';
}

function getWechatCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res: { code?: string; errMsg?: string }) => {
        if (res.code) {
          resolve(res.code);
          return;
        }
        reject(new Error(res.errMsg ?? 'wx.login returned no code'));
      },
      fail: (err: { errMsg?: string } = {}) => {
        reject(new Error(err.errMsg ?? 'wx.login failed'));
      },
    });
  });
}

async function handleWechatLogin() {
  if (wechatLoading.value) {
    return;
  }

  wechatLoading.value = true;
  hint.value = '';

  try {
    const wxCode = await getWechatCode();
    const session = await loginWithWechat(wxCode);
    authStore.setSession(session);
    hint.value = `欢迎，${session.user.nickname}`;
    continueAfterLogin();
  } catch (error) {
    hint.value = `微信登录失败：${error instanceof Error ? error.message : '未知错误'}`;
  } finally {
    wechatLoading.value = false;
  }
}
</script>

<template>
  <view class="page">
    <view class="card">
      <text class="eyebrow">Pingpang</text>
      <text class="title">手机号验证登录</text>
      <text class="subtitle">输入手机号，获取验证码后进入约球。</text>

      <view v-if="hasSession" class="session-card">
        <text class="session-title">当前已登录</text>
        <text class="session-copy">{{ authStore.user?.nickname }} · {{ authStore.user?.phone }}</text>
        <button class="secondary-button" data-testid="login-logout-action" @click="handleLogout">退出当前账号</button>
      </view>

      <input
        v-model="phone"
        class="input"
        type="number"
        maxlength="11"
        placeholder="请输入 11 位手机号"
        data-testid="login-phone"
      />
      <input
        v-model="code"
        class="input"
        type="number"
        maxlength="6"
        placeholder="6 位验证码"
        data-testid="login-code"
      />

      <button
        class="ghost-button"
        data-testid="login-request-code"
        :disabled="!phoneValid || requesting"
        @click="handleRequestCode"
      >
        {{ requesting ? '发送中...' : codeSent ? '重新发送验证码' : '获取验证码' }}
      </button>
      <button
        class="primary-button"
        data-testid="login-submit"
        :loading="loading"
        :disabled="!phoneValid || !codeValid || loading"
        @click="handleLogin"
      >
        {{ loading ? '登录中...' : '登录并继续' }}
      </button>

      <view v-if="wechatLoginAvailable" class="wechat-divider"><text>或</text></view>
      <button
        v-if="wechatLoginAvailable"
        class="wechat-button"
        data-testid="login-wechat"
        :disabled="wechatLoading"
        @click="handleWechatLogin"
      >
        {{ wechatLoading ? '微信登录中...' : '微信一键登录' }}
      </button>

      <text v-if="hint" class="hint">{{ hint }}</text>
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

.ghost-button[disabled] {
  opacity: 0.5;
}

.primary-button {
  margin-top: 20rpx;
  background: $color-primary;
}

.primary-button[disabled] {
  opacity: 0.55;
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

.wechat-divider {
  display: flex;
  align-items: center;
  margin: 28rpx 0 14rpx;
  color: $color-muted;
  font-size: 22rpx;
  text-align: center;
}

.wechat-divider text {
  margin: 0 auto;
  padding: 0 18rpx;
}

.wechat-button {
  border-radius: 999rpx;
  background: #07c160;
  color: #fff;
}

.wechat-button[disabled] {
  opacity: 0.6;
}
</style>
