<script setup lang="ts">
/**
 * Email + password login & registration. Two tabs share one card:
 *
 *   - "登录" : email + password → /auth/email/login
 *   - "注册" : email + password + confirm + nickname (+ city/level) → /auth/email/register
 *              → auto-login with returned token
 *
 * Notes:
 *  - The consent checkbox is hand-rolled (a <view> with a tick icon)
 *    because uni-app's <checkbox> renders inconsistently in H5 — clicks
 *    on it silently dropped, which is why the previous build appeared
 *    to do nothing when users tried to submit.
 *  - Phone-OTP and WeChat one-tap stay accessible from a small footer
 *    link for users who explicitly want them.
 */
import { computed, ref } from 'vue';
import { loginEmailUser, loginWithWechat, registerEmailUser } from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { useLocationStore } from '../../stores/location';
import { nearestCity } from '../../utils/geo';
import { toast } from '../../utils/toast';
import AppToast from '../../components/AppToast.vue';
import AppModal from '../../components/AppModal.vue';
import type { LoginEmailPayload, RegisterEmailPayload, SessionPayload } from '../../services/types';

type Mode = 'login' | 'register';

const authStore = useAuthStore();
const locationStore = useLocationStore();
// We intentionally do NOT call locationStore.ensure() here. Triggering
// the geolocation prompt the instant the login page opens was confusing
// users (and earlier wired itself into a transient "loading" stripe in
// the H5 navigation bar). City defaulting on register still works — we
// either reuse a cached value (set by other pages) or fall through to
// Beijing.

const mode = ref<Mode>('login');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const nickname = ref('');
const showPassword = ref(false);
const agreedToTerms = ref(false);

const submitting = ref(false);
const wechatLoading = ref(false);
const hint = ref('');
const hintTone = ref<'info' | 'error' | 'success'>('info');

/**
 * Pick the city to stamp on the new user. Three-tier fallback:
 *   1. Cached browser/wechat location → nearest supported city (≤200km)
 *   2. No location or too far → "北京" default
 * Level is hard-wired to "beginner" — the previous form let users pick
 * but the field was friction with little payoff for v1.
 */
function resolvedRegisterCity(): string {
  const coords = locationStore.coords;
  if (coords) {
    const nearby = nearestCity(coords);
    if (nearby) return nearby;
  }
  return '北京';
}

const tabPaths = new Set([
  '/pages/home/index',
  '/pages/square/index',
  '/pages/messages/index',
  '/pages/profile/index',
]);
const hasSession = computed(() => Boolean(authStore.token && authStore.user));

const wechatLoginAvailable = computed(() => {
  if (typeof uni === 'undefined' || !('login' in uni)) return false;
  const wx = (globalThis as { wx?: { login?: unknown } }).wx;
  return Boolean(wx && typeof wx.login === 'function');
});

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()));
const passwordValid = computed(() => password.value.length >= 8 && password.value.length <= 100);
const nicknameValid = computed(() => {
  const n = nickname.value.trim();
  return n.length >= 2 && n.length <= 20;
});
const confirmValid = computed(() => password.value === confirmPassword.value);

/**
 * Per-field error strings. Only surface them once the user has typed
 * SOMETHING in the field — showing "邮箱格式不正确" on an empty box the
 * second the page loads is needlessly alarming.
 */
const emailError = computed(() => {
  if (!email.value) return '';
  return emailValid.value ? '' : '邮箱格式不正确';
});
const passwordError = computed(() => {
  if (!password.value) return '';
  return passwordValid.value ? '' : '密码至少 8 位';
});
const confirmError = computed(() => {
  if (mode.value !== 'register' || !confirmPassword.value) return '';
  return confirmValid.value ? '' : '两次输入的密码不一致';
});
const nicknameError = computed(() => {
  if (mode.value !== 'register' || !nickname.value) return '';
  return nicknameValid.value ? '' : '昵称需要 2–20 个字符';
});

const canSubmit = computed(() => {
  if (!agreedToTerms.value) return false;
  if (!emailValid.value || !passwordValid.value) return false;
  if (mode.value === 'register' && (!nicknameValid.value || !confirmValid.value)) return false;
  return !submitting.value;
});

const submitLabel = computed(() => {
  if (submitting.value) return mode.value === 'login' ? '登录中…' : '注册中…';
  return mode.value === 'login' ? '登录' : '注册并进入';
});

/**
 * Notify the user. Errors + successes now also pop a centred toast so
 * the user sees feedback even if they're focused on the keyboard /
 * a button mid-tap. The inline hint is kept around for cases where we
 * want a persistent message under the form (eg. the consent reminder).
 */
function setHint(text: string, tone: 'info' | 'error' | 'success' = 'info') {
  hint.value = text;
  hintTone.value = tone;
  if (text && tone !== 'info') toast(text, tone);
}

/** Toast-only feedback (no inline hint). Used for transient validation. */
function notify(text: string, tone: 'info' | 'error' | 'success' = 'error') {
  toast(text, tone);
}

function switchMode(next: Mode) {
  if (mode.value === next) return;
  mode.value = next;
  // Re-use email if the user already typed one; clear the rest so the
  // forms don't carry over stale state between tabs.
  password.value = '';
  confirmPassword.value = '';
  setHint('');
}

function getRedirectFromLocation() {
  if (typeof window === 'undefined') return '';
  const hashStr = window.location.hash || '';
  const queryIndex = hashStr.indexOf('?');
  if (queryIndex === -1) return '';
  const params = new URLSearchParams(hashStr.slice(queryIndex + 1));
  return params.get('redirect') ?? '';
}

function continueAfterLogin() {
  const redirect = getRedirectFromLocation();
  if (redirect) {
    if (tabPaths.has(redirect)) uni.switchTab({ url: redirect });
    else uni.navigateTo({ url: redirect });
    return;
  }
  uni.switchTab({ url: '/pages/home/index' });
}

function applySession(session: SessionPayload, message: string) {
  authStore.setSession(session);
  setHint(message, 'success');
  continueAfterLogin();
}

async function handleSubmit() {
  if (!agreedToTerms.value) {
    setHint('请先勾选用户协议与隐私政策', 'error');
    return;
  }
  if (!emailValid.value) {
    setHint('请输入有效的邮箱地址', 'error');
    return;
  }
  if (!passwordValid.value) {
    setHint('密码至少 8 位', 'error');
    return;
  }
  if (mode.value === 'register') {
    if (!nicknameValid.value) {
      setHint('昵称需要 2–20 个字符', 'error');
      return;
    }
    if (!confirmValid.value) {
      setHint('两次输入的密码不一致', 'error');
      return;
    }
  }
  if (submitting.value) return;
  submitting.value = true;
  setHint('');

  try {
    if (mode.value === 'login') {
      const payload: LoginEmailPayload = {
        email: email.value.trim(),
        password: password.value,
      };
      const session = await loginEmailUser(payload);
      applySession(session, `欢迎回来，${session.user.nickname}`);
    } else {
      const payload: RegisterEmailPayload = {
        email: email.value.trim(),
        password: password.value,
        nickname: nickname.value.trim(),
        // City auto-detected from geolocation; beginner is the v1 default.
        // Users can change both later from the profile page.
        city: resolvedRegisterCity(),
        level: 'beginner',
      };
      const session = await registerEmailUser(payload);
      applySession(session, `欢迎加入，${session.user.nickname}`);
    }
  } catch (error) {
    // uni.request rejects with the raw response object, not an Error —
    // the useful info lives in statusCode + data.message.
    const resp = error as { statusCode?: number; data?: { message?: string } };
    const status = resp.statusCode ?? 0;
    const serverMessage = resp.data?.message ?? '';
    if (mode.value === 'register') {
      if (status === 409) {
        setHint('这个邮箱已经注册过了，去登录吧', 'error');
        mode.value = 'login';
      } else if (status === 400) {
        setHint('表单内容不符合要求，请检查后重试', 'error');
      } else {
        setHint('注册失败，请稍后再试', 'error');
      }
    } else {
      // Login: backend distinguishes `user_not_found` from
      // `invalid_password` via the message field so we can show
      // friendlier copy than a blanket "邮箱或密码错误".
      if (status === 401 && serverMessage === 'user_not_found') {
        setHint('该邮箱还没注册，请先去注册', 'error');
        mode.value = 'register';
      } else if (status === 401 && serverMessage === 'invalid_password') {
        setHint('密码不正确，请重新输入', 'error');
      } else if (status === 401) {
        setHint('邮箱或密码不正确', 'error');
      } else if (status === 400) {
        setHint('表单内容不符合要求，请检查后重试', 'error');
      } else {
        setHint('登录失败，请稍后再试', 'error');
      }
    }
  } finally {
    submitting.value = false;
  }
}

function handleLogout() {
  authStore.clearSession();
  email.value = '';
  password.value = '';
  confirmPassword.value = '';
  nickname.value = '';
  setHint('当前账号已退出，你可以重新登录');
}

function openLegalPage(path: string) {
  uni.navigateTo({ url: path });
}

function getWechatCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: (res: { code?: string; errMsg?: string }) => {
        if (res.code) resolve(res.code);
        else reject(new Error(res.errMsg ?? 'wx.login returned no code'));
      },
      fail: (err: { errMsg?: string } = {}) => {
        reject(new Error(err.errMsg ?? 'wx.login failed'));
      },
    });
  });
}

async function handleWechatLogin() {
  if (wechatLoading.value) return;
  if (!agreedToTerms.value) {
    setHint('请先勾选用户协议与隐私政策', 'error');
    return;
  }
  wechatLoading.value = true;
  setHint('');
  try {
    const wxCode = await getWechatCode();
    const session = await loginWithWechat(wxCode);
    applySession(session, `欢迎，${session.user.nickname}`);
  } catch (error) {
    setHint(`微信登录失败：${error instanceof Error ? error.message : '未知错误'}`, 'error');
  } finally {
    wechatLoading.value = false;
  }
}
</script>

<template>
  <view class="page">
    <view class="hero">
      <view class="hero-logo">
        <text class="hero-logo-emoji">🏓</text>
      </view>
      <text class="hero-eyebrow">乒乓约球</text>
      <text class="hero-title">{{ mode === 'login' ? '欢迎回来' : '加入约球' }}</text>
      <text class="hero-subtitle">{{ mode === 'login' ? '用邮箱和密码登录' : '邮箱注册即可发起球局' }}</text>
    </view>

    <view class="card">
      <!-- Wrap the auth fields in a real <form>. Without it, browsers
           and password managers don't recognise the email/password pair
           and won't offer save / autofill. We capture submit so the
           form action never actually navigates. -->
      <form @submit.prevent="handleSubmit">

      <!-- Mode tabs -->
      <view class="tabs" data-testid="mode-tabs">
        <view
          class="tab"
          :class="{ 'tab--active': mode === 'login' }"
          data-testid="tab-login"
          @click="switchMode('login')"
        >登录</view>
        <view
          class="tab"
          :class="{ 'tab--active': mode === 'register' }"
          data-testid="tab-register"
          @click="switchMode('register')"
        >注册</view>
      </view>

      <view v-if="hasSession" class="session-card">
        <text class="session-title">当前已登录</text>
        <text class="session-copy">
          {{ authStore.user?.nickname }}
          <text v-if="authStore.user?.email"> · {{ authStore.user.email }}</text>
          <text v-else-if="authStore.user?.phone"> · {{ authStore.user.phone }}</text>
        </text>
        <view class="ghost-button" data-testid="login-logout-action" @click="handleLogout">退出当前账号</view>
      </view>

      <!-- Shared fields -->
      <text class="field-label">邮箱地址</text>
      <view class="input-shell" :class="{ 'input-shell--error': emailError }">
        <text class="input-prefix">✉</text>
        <input
          v-model="email"
          class="input"
          type="text"
          maxlength="254"
          placeholder="name@example.com"
          autocomplete="email"
          data-testid="login-email"
        />
      </view>
      <text v-if="emailError" class="field-error">{{ emailError }}</text>

      <text class="field-label">密码</text>
      <view class="input-shell" :class="{ 'input-shell--error': passwordError }">
        <text class="input-prefix">🔒</text>
        <input
          v-model="password"
          class="input"
          :type="showPassword ? 'text' : 'password'"
          maxlength="100"
          placeholder="至少 8 位"
          :password="!showPassword"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          data-testid="login-password"
        />
        <text class="input-toggle" data-testid="toggle-password" @click="showPassword = !showPassword">
          {{ showPassword ? '隐藏' : '显示' }}
        </text>
      </view>
      <text v-if="passwordError" class="field-error">{{ passwordError }}</text>

      <template v-if="mode === 'register'">
        <text class="field-label">再次输入密码</text>
        <view class="input-shell" :class="{ 'input-shell--error': confirmError }">
          <text class="input-prefix">🔒</text>
          <input
            v-model="confirmPassword"
            class="input"
            :type="showPassword ? 'text' : 'password'"
            maxlength="100"
            placeholder="再输入一次"
            :password="!showPassword"
            autocomplete="new-password"
            data-testid="register-confirm"
          />
        </view>
        <text v-if="confirmError" class="field-error">{{ confirmError }}</text>

        <text class="field-label">昵称</text>
        <view class="input-shell" :class="{ 'input-shell--error': nicknameError }">
          <input
            v-model="nickname"
            class="input"
            maxlength="20"
            placeholder="2–20 个字"
            data-testid="register-nickname"
          />
        </view>
        <text v-if="nicknameError" class="field-error">{{ nicknameError }}</text>

        <!-- City + level were previously chip pickers here. Removed in
             v1.1 — city auto-detects from browser location (北京 fallback)
             and level defaults to 入门. Both can be edited later from
             the profile page. -->
      </template>

      <!-- Consent: rolled by hand because uni-app's <checkbox> swallows
           taps in H5 silently, which is what made the previous build
           seem unresponsive when users tried to submit. -->
      <view class="legal-consent" data-testid="login-consent" @click="agreedToTerms = !agreedToTerms">
        <view class="legal-check" :class="{ 'legal-check--on': agreedToTerms }">
          <text v-if="agreedToTerms" class="legal-check-tick">✓</text>
        </view>
        <text class="legal-text">
          我已阅读并同意
          <text class="legal-link" @click.stop="openLegalPage('/pages/legal/terms')">《用户协议》</text>
          和
          <text class="legal-link" @click.stop="openLegalPage('/pages/legal/privacy')">《隐私政策》</text>
        </text>
      </view>

      <!-- Native <button type="submit"> so password managers know which
           control commits the form; styled as a view to keep the
           existing primary-button look without uni-app's button shadow. -->
      <button
        type="submit"
        class="primary-button"
        :class="{ 'primary-button--disabled': !canSubmit }"
        data-testid="login-submit"
      >
        {{ submitLabel }}
      </button>

      </form>

      <text
        v-if="hint"
        class="hint"
        :class="{ 'hint--error': hintTone === 'error', 'hint--success': hintTone === 'success' }"
        data-testid="login-hint"
      >
        {{ hint }}
      </text>

      <view v-if="wechatLoginAvailable" class="wechat-divider"><text>或</text></view>
      <view
        v-if="wechatLoginAvailable"
        class="wechat-button"
        :class="{ 'wechat-button--disabled': wechatLoading }"
        data-testid="login-wechat"
        @click="!wechatLoading && handleWechatLogin()"
      >
        <text class="wechat-icon">💬</text>
        {{ wechatLoading ? '微信登录中...' : '微信一键登录' }}
      </view>
    </view>

    <!-- Self-hosted toast renderer. Rendered per-page (uni-app's App.vue
         doesn't accept a template) so login feedback always pops even
         when uni.showToast's polyfill misbehaves. -->
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
  background:
    radial-gradient(circle at top left, rgba(255, 106, 61, 0.22), transparent 42%),
    radial-gradient(circle at bottom right, rgba(255, 143, 87, 0.16), transparent 50%),
    linear-gradient(180deg, #fff3e6 0%, #fff9f1 48%, #fffdf9 100%);
}

/*
 * Kill the dark grey overlay mobile browsers (esp. WeChat / MIUI / iOS Safari)
 * paint on top of tappable elements. Applies to everything inside the login
 * card so tabs, chips, the consent row, and primary/ghost/wechat buttons all
 * feel responsive without the "loading" flash the user reported.
 */
.page,
.page view,
.page text,
.page input {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
.tab,
.chip,
.level-card,
.legal-consent,
.primary-button,
.ghost-button,
.wechat-button,
.field-link,
.input-toggle,
.legal-link {
  user-select: none;
  cursor: pointer;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-top: 36rpx;
  margin-bottom: 28rpx;
}
.hero-logo {
  width: 120rpx;
  height: 120rpx;
  border-radius: 32rpx;
  background: linear-gradient(135deg, #ff6a3d, #ff8f57);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 18rpx 36rpx rgba(255, 106, 61, 0.32);
  margin-bottom: 18rpx;
}
.hero-logo-emoji { font-size: 60rpx; }
.hero-eyebrow {
  font-size: 22rpx;
  font-weight: 700;
  letter-spacing: 4rpx;
  color: $color-primary;
  margin-bottom: 8rpx;
}
.hero-title { font-size: 44rpx; font-weight: 800; color: $color-ink; line-height: 1.2; }
.hero-subtitle {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: $color-muted;
}

.card {
  border-radius: 36rpx;
  padding: 36rpx 32rpx;
  background: $color-surface;
  box-shadow: 0 18rpx 60rpx rgba(15, 28, 46, 0.06);
}

/* ---- Tabs ---- */
.tabs {
  display: flex;
  background: rgba(15, 28, 46, 0.05);
  border-radius: 999rpx;
  padding: 6rpx;
  margin-bottom: 28rpx;
}
.tab {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 700;
  color: $color-muted;
  transition: all 0.2s ease;
}
.tab--active {
  background: #ffffff;
  color: $color-primary;
  box-shadow: 0 6rpx 14rpx rgba(255, 106, 61, 0.18);
}

/* ---- Form fields ---- */
.field-label {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $color-ink;
  margin: 18rpx 0 12rpx 0;
}
.field-section {
  display: block;
  font-size: 24rpx;
  color: $color-muted;
  margin: 24rpx 0 12rpx 0;
}

.input-shell {
  display: flex;
  align-items: center;
  background: #fff8f1;
  border: 1px solid rgba(255, 106, 61, 0.16);
  border-radius: 24rpx;
  padding: 0 24rpx;
  height: 96rpx;
  transition: border-color 0.15s ease;
}
.input-shell--error {
  border-color: #ff8a5b;
  background: #fff4ec;
}
.field-error {
  display: block;
  margin: -10rpx 4rpx 8rpx;
  font-size: 22rpx;
  color: #c0461d;
}
.input-prefix {
  color: $color-muted;
  font-size: 26rpx;
  margin-right: 12rpx;
}
.input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 30rpx;
  color: $color-ink;
  outline: none;
  height: 96rpx;
  line-height: 96rpx;
}
.input-toggle {
  font-size: 24rpx;
  color: $color-primary;
  font-weight: 700;
  padding-left: 12rpx;
}

/* ---- City chips ---- */
.chip-row { display: flex; flex-wrap: wrap; gap: 14rpx; }
.chip {
  padding: 12rpx 24rpx;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.06);
  color: $color-ink;
  font-size: 24rpx;
  font-weight: 600;
}
.chip--active {
  background: $color-primary;
  color: #fff;
  box-shadow: 0 6rpx 14rpx rgba(255, 106, 61, 0.32);
}

/* ---- Level cards ---- */
.level-list { display: flex; flex-direction: column; gap: 14rpx; }
.level-card {
  padding: 20rpx 24rpx;
  border-radius: 24rpx;
  background: #fff8f1;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}
.level-card--active {
  border-color: $color-primary;
  background: rgba(255, 106, 61, 0.08);
}
.level-card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6rpx; }
.level-card-title { font-size: 28rpx; font-weight: 800; color: $color-ink; }
.level-card-tick { color: $color-primary; font-weight: 800; font-size: 28rpx; }
.level-card-copy { font-size: 22rpx; color: $color-muted; line-height: 1.5; }

/* ---- Consent (hand-rolled checkbox) ---- */
.legal-consent {
  display: flex;
  align-items: flex-start;
  gap: 14rpx;
  margin-top: 28rpx;
  padding: 8rpx 4rpx;
}
.legal-check {
  width: 36rpx;
  height: 36rpx;
  border-radius: 8rpx;
  border: 2rpx solid rgba(15, 28, 46, 0.24);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 4rpx;
  flex-shrink: 0;
  transition: all 0.15s ease;
}
.legal-check--on {
  background: $color-primary;
  border-color: $color-primary;
}
.legal-check-tick { color: #fff; font-size: 24rpx; font-weight: 700; }
.legal-text {
  font-size: 24rpx;
  line-height: 1.6;
  color: $color-muted;
  flex: 1;
}
.legal-link { color: $color-primary; }

/* ---- Buttons ---- */
.primary-button {
  width: 100%;
  margin-top: 28rpx;
  height: 96rpx;
  line-height: 96rpx;
  text-align: center;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #ff6a3d, #ff8f57);
  color: #fff;
  font-size: 30rpx;
  font-weight: 800;
  box-shadow: 0 12rpx 28rpx rgba(255, 106, 61, 0.34);
}
.primary-button--disabled {
  background: #ffd2bd;
  box-shadow: none;
  color: rgba(255, 255, 255, 0.85);
}
.ghost-button {
  width: 100%;
  margin: 12rpx 0 0 0;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 999rpx;
  background: rgba(15, 28, 46, 0.06);
  color: $color-ink;
  font-size: 26rpx;
  font-weight: 700;
}

.session-card {
  margin-bottom: 24rpx;
  padding: 24rpx;
  border-radius: 24rpx;
  background: #fff7ef;
}
.session-title { display: block; font-size: 22rpx; color: $color-muted; margin-bottom: 6rpx; }
.session-copy { display: block; font-size: 28rpx; color: $color-ink; font-weight: 700; margin-bottom: 12rpx; }

.hint {
  display: block;
  margin-top: 18rpx;
  font-size: 24rpx;
  text-align: center;
  line-height: 1.5;
  color: $color-muted;
}
.hint--error { color: #d1432f; }
.hint--success { color: #1f8f43; }

.wechat-divider {
  display: flex;
  align-items: center;
  margin: 32rpx 0 16rpx;
  color: $color-muted;
  font-size: 22rpx;
}
.wechat-divider::before,
.wechat-divider::after { content: ''; flex: 1; height: 1px; background: rgba(15, 28, 46, 0.08); }
.wechat-divider text { padding: 0 16rpx; }
.wechat-button {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  border-radius: 999rpx;
  background: #07c160;
  color: #fff;
  font-size: 28rpx;
  font-weight: 700;
}
.wechat-button--disabled { opacity: 0.6; }
.wechat-icon { margin-right: 10rpx; }
</style>
