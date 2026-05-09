import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import LoginPage from '../pages/login/index.vue';

describe('LoginPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('redirects back to the original page after a successful login', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    window.location.hash =
      '#/pages/login/index?redirect=%2Fpages%2Fmatch-detail%2Findex%3Fid%3Dmatch-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/auth/verify-code')) {
          success({
            statusCode: 200,
            data: {
              token: 'dev-token-13800138000',
              user: {
                id: 'user-13800138000',
                phone: '13800138000',
                nickname: '球友1380013',
                city: '上海',
                level: 'intermediate',
                creditScore: 100,
              },
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            ok: true,
            phone: '13800138000',
            devCode: '123456',
          },
        });
      },
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
      navigateTo: vi.fn(({ url }: { url: string }) => {
        window.location.hash = `#${url}`;
      }),
      switchTab: vi.fn(({ url }: { url: string }) => {
        window.location.hash = `#${url}`;
      }),
    });

    const wrapper = mount(LoginPage, {
      global: {
        plugins: [pinia],
      },
    });

    await wrapper.get('.primary-button').trigger('click');

    await vi.waitFor(() => {
      expect(window.location.hash).toBe('#/pages/match-detail/index?id=match-seed-1');
    });
  });
});
