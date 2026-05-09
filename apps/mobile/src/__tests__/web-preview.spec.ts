import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import WebPreviewApp from '../web-preview/App.vue';

describe('WebPreviewApp', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('shows tabbar on tab pages', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    window.location.hash = '#/pages/home/index';

    vi.stubGlobal('uni', {
      request: ({ success }: { success: (response: { statusCode: number; data: unknown }) => void }) => {
        success({
          statusCode: 200,
          data: {
            items: [],
          },
        });
      },
      navigateTo: vi.fn(),
      switchTab: vi.fn(),
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(WebPreviewApp, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('.preview-tabbar').exists()).toBe(true);
    });
  });

  it('hides tabbar on non-tab detail pages so bottom CTA stays clickable', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);

    window.location.hash = '#/pages/match-detail/index?id=match-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        success,
      }: {
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        success({
          statusCode: 200,
          data: {
            id: 'match-seed-1',
            title: '徐汇晚间上分局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2026-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66.06,
          },
        });
      },
      navigateTo: vi.fn(),
      switchTab: vi.fn(),
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(WebPreviewApp, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('徐汇晚间上分局');
    });

    expect(wrapper.find('.preview-tabbar').exists()).toBe(false);
    expect(wrapper.find('.preview-navbar').exists()).toBe(true);
  });
});
