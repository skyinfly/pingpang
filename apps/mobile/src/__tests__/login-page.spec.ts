import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginPage from '../pages/login/index.vue';

/**
 * Email + password login & registration. Two tabs:
 *   - login    : email + password
 *   - register : email + password + confirm + nickname (+ city/level)
 */

type RequestHandler = (call: { url: string; method?: string; data?: unknown }) => unknown;

function setupUni(handle: RequestHandler) {
  vi.stubGlobal('uni', {
    request: ({
      url,
      method,
      data,
      success,
    }: {
      url: string;
      method?: string;
      data?: unknown;
      success: (response: { statusCode: number; data: unknown }) => void;
    }) => {
      success({ statusCode: 200, data: handle({ url, method, data }) });
    },
    setStorageSync: vi.fn(),
    getStorageSync: vi.fn(() => ''),
    removeStorageSync: vi.fn(),
    showToast: vi.fn(),
    showModal: vi.fn(),
    navigateTo: vi.fn(({ url }: { url: string }) => {
      window.location.hash = `#${url}`;
    }),
    switchTab: vi.fn(({ url }: { url: string }) => {
      window.location.hash = `#${url}`;
    }),
  });
}

describe('LoginPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('login tab: submits email + password and redirects back', async () => {
    setActivePinia(createPinia());
    window.location.hash =
      '#/pages/login/index?redirect=%2Fpages%2Fmatch-detail%2Findex%3Fid%3Dmatch-seed-1';

    setupUni(({ url }) => {
      if (url.endsWith('/auth/email/login')) {
        return {
          token: 'dev-token-email',
          user: {
            id: 'user-email',
            phone: null,
            email: 'returning@pingpang.app',
            nickname: '回归球友',
            city: '上海',
            level: 'intermediate',
            creditScore: 100,
          },
        };
      }
      if (url.endsWith('/location/ip')) return { available: false };
      throw new Error(`unexpected url ${url}`);
    });

    const wrapper = mount(LoginPage);

    await wrapper.get('[data-testid="login-email"]').setValue('returning@pingpang.app');
    await wrapper.get('[data-testid="login-password"]').setValue('goodPassword1');
    // Custom checkbox: a plain view; trigger click on the container.
    await wrapper.get('[data-testid="login-consent"]').trigger('click');
    // Form is real `<form>` now (so the browser password manager picks
    // it up); submit goes through @submit.prevent, not a raw click.
    await wrapper.get('form').trigger('submit');

    await vi.waitFor(() => {
      expect(window.location.hash).toBe('#/pages/match-detail/index?id=match-seed-1');
    });
  });

  it('register tab: requires nickname + matching password, then auto-logs in', async () => {
    setActivePinia(createPinia());

    setupUni(({ url, data }) => {
      if (url.endsWith('/auth/email/register')) {
        const payload = data as { email: string; nickname: string };
        return {
          token: 'dev-token-new',
          user: {
            id: 'user-new',
            phone: null,
            email: payload.email,
            nickname: payload.nickname,
            city: '杭州',
            level: 'advanced',
            creditScore: 100,
          },
        };
      }
      if (url.endsWith('/location/ip')) return { available: false };
      throw new Error(`unexpected url ${url}`);
    });

    const wrapper = mount(LoginPage);

    // Switch to register tab.
    await wrapper.get('[data-testid="tab-register"]').trigger('click');

    await wrapper.get('[data-testid="login-email"]').setValue('new@pingpang.app');
    await wrapper.get('[data-testid="login-password"]').setValue('goodPassword1');
    await wrapper.get('[data-testid="register-confirm"]').setValue('goodPassword1');
    await wrapper.get('[data-testid="register-nickname"]').setValue('新球友');
    await wrapper.get('[data-testid="login-consent"]').trigger('click');
    // Form is real `<form>` now (so the browser password manager picks
    // it up); submit goes through @submit.prevent, not a raw click.
    await wrapper.get('form').trigger('submit');

    await vi.waitFor(() => {
      expect(window.location.hash).toBe('#/pages/home/index');
    });
  });

  it('blocks submit until terms are accepted', async () => {
    setActivePinia(createPinia());

    let authCallCount = 0;
    setupUni(({ url }) => {
      // Filter to only auth requests — the page also fires /location/ip
      // on mount (LocationHeader + register city resolver) and we don't
      // want that to count as "submitted".
      if (url.includes('/auth/email/login')) {
        authCallCount += 1;
        return { token: 't', user: { id: 'u', phone: null, nickname: 'x', city: '上海', level: 'intermediate', creditScore: 100 } };
      }
      if (url.endsWith('/location/ip')) {
        return { available: false };
      }
      throw new Error(`unexpected url ${url}`);
    });

    const wrapper = mount(LoginPage);
    await wrapper.get('[data-testid="login-email"]').setValue('a@b.com');
    await wrapper.get('[data-testid="login-password"]').setValue('goodPassword1');
    // Don't tick consent.
    // Form is real `<form>` now (so the browser password manager picks
    // it up); submit goes through @submit.prevent, not a raw click.
    await wrapper.get('form').trigger('submit');
    expect(authCallCount).toBe(0);
    expect(wrapper.get('[data-testid="login-hint"]').text()).toContain('用户协议');
  });
});
