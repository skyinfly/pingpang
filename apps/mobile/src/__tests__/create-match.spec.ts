import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import CreateMatchPage from '../pages/create-match/index.vue';
import { useMatchDraftStore } from '../stores/match-draft';
import { useAuthStore } from '../stores/auth';

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const matchOptionsResponse = {
  venues: [
    {
      id: 'venue-seed-1',
      name: '徐家汇活力馆',
      city: '上海',
      district: '徐汇',
      distanceKm: 1.8,
      sortOrder: 1,
      courts: [
        { id: 'venue-court-1', name: '3号台', sortOrder: 1 },
        { id: 'venue-court-2', name: '5号台', sortOrder: 2 },
      ],
    },
    {
      id: 'venue-seed-2',
      name: '静安寺白领馆',
      city: '上海',
      district: '静安',
      distanceKm: 3.2,
      sortOrder: 2,
      courts: [
        { id: 'venue-court-3', name: '2号台', sortOrder: 1 },
        { id: 'venue-court-4', name: '4号台', sortOrder: 2 },
      ],
    },
  ],
  timeSlots: [
    {
      id: 'venue-slot-1',
      slotId: 'venue-slot-1',
      venueId: 'venue-seed-1',
      venueName: '徐家汇活力馆',
      label: '工作日晚间',
      startTime: '19:30',
      endTime: '20:30',
      sortOrder: 1,
    },
    {
      id: 'venue-slot-4',
      slotId: 'venue-slot-4',
      venueId: 'venue-seed-2',
      venueName: '静安寺白领馆',
      label: '下班开打',
      startTime: '18:30',
      endTime: '20:00',
      sortOrder: 4,
    },
  ],
  levels: [
    { id: 'level-beginner', value: 'beginner', label: '初级', sortOrder: 1 },
    { id: 'level-intermediate', value: 'intermediate', label: '中级', sortOrder: 2 },
    { id: 'level-advanced', value: 'advanced', label: '高级', sortOrder: 3 },
  ],
  playerCounts: [
    { id: 'player-count-2', value: 2, label: '2 人局', sortOrder: 1 },
    { id: 'player-count-4', value: 4, label: '4 人局', sortOrder: 2 },
    { id: 'player-count-6', value: 6, label: '6 人局', sortOrder: 3 },
  ],
};

describe('CreateMatchPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads selectable venue, court, time, level and player options from the API', async () => {
    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/match-options')) {
          success({ statusCode: 200, data: matchOptionsResponse });
          return;
        }

        throw new Error(`Unexpected request: ${url}`);
      },
      navigateTo: vi.fn(),
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(CreateMatchPage);
    await flushPromises();

    expect(wrapper.text()).toContain('发布约局');
    expect(wrapper.text()).toContain('快速发局');
    expect(wrapper.text()).toContain('球馆');
    expect(wrapper.text()).toContain('球台');
    expect(wrapper.text()).toContain('开局时间');
    expect(wrapper.text()).toContain('水平');
    expect(wrapper.text()).toContain('人数');
    expect(wrapper.text()).toContain('发布后会生成球局详情，并开放申请加入。');
    expect(wrapper.text()).toContain('登录后发布');
    expect(wrapper.text()).toContain('徐家汇活力馆');
    expect(wrapper.text()).toContain('工作日晚间 19:30');
    expect(wrapper.text()).toContain('3号台');

    await wrapper.get('[data-testid="venue-option-venue-seed-2"]').trigger('click');
    await wrapper.get('[data-testid="court-option-venue-court-3"]').trigger('click');
    await wrapper.get('[data-testid="time-option-venue-slot-4"]').trigger('click');
    await wrapper.get('[data-testid="players-option-2"]').trigger('click');

    expect(wrapper.text()).toContain('静安寺白领馆');
    expect(wrapper.text()).toContain('下班开打 18:30');
    expect(wrapper.text()).toContain('2号台');
    expect(wrapper.text()).toContain('2 人局');
  });

  it('redirects to login when the user is not signed in', async () => {
    const navigateTo = vi.fn();

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/match-options')) {
          success({ statusCode: 200, data: matchOptionsResponse });
          return;
        }

        throw new Error(`Unexpected request: ${url}`);
      },
      navigateTo,
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(CreateMatchPage);
    await flushPromises();

    await wrapper.get('[data-testid="publish-match"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index?redirect=%2Fpages%2Fcreate-match%2Findex',
    });
  });

  it('creates a match from API-driven options and returns to the profile tab', async () => {
    const authStore = useAuthStore();
    const navigateTo = vi.fn();
    const switchTab = vi.fn();
    const requests: Array<{
      url: string;
      method?: string;
      data?: Record<string, unknown>;
      header?: Record<string, string>;
    }> = [];

    vi.stubGlobal('uni', {
      request: ({
        url,
        method,
        data,
        header,
        success,
      }: {
        url: string;
        method?: string;
        data?: Record<string, unknown>;
        header?: Record<string, string>;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        requests.push({ url, method, data, header });

        if (url.endsWith('/match-options')) {
          success({ statusCode: 200, data: matchOptionsResponse });
          return;
        }

        if (url.endsWith('/matches')) {
          success({
            statusCode: 201,
            data: {
              id: 'match-created-1',
              title: '静安寺白领馆 2号台 · 下班开打约球',
              courtId: 'venue-court-3',
              slotId: 'venue-slot-4',
              venueName: '静安寺白领馆 2号台',
              startTime: '2026-04-23T18:30:00+08:00',
              city: '上海',
              level: 'intermediate',
              maxPlayers: 2,
              openSlots: 1,
              hostCreditScore: 100,
              distanceKm: 3.2,
              matchRate: 89,
              score: 70.16,
            },
          });
          return;
        }

        throw new Error(`Unexpected request: ${url}`);
      },
      navigateTo,
      switchTab,
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    authStore.setSession({
      token: 'dev-token-13800138000',
      user: {
        id: 'user-13800138000',
        phone: '13800138000',
        nickname: '球友1380013',
        city: '上海',
        level: 'intermediate',
        creditScore: 100,
      },
    });

    const wrapper = mount(CreateMatchPage);
    await flushPromises();

    expect(wrapper.text()).toContain('确认发布球局');

    await wrapper.get('[data-testid="venue-option-venue-seed-2"]').trigger('click');
    await wrapper.get('[data-testid="court-option-venue-court-3"]').trigger('click');
    await wrapper.get('[data-testid="time-option-venue-slot-4"]').trigger('click');
    await wrapper.get('[data-testid="players-option-2"]').trigger('click');
    await wrapper.get('[data-testid="publish-match"]').trigger('click');
    await flushPromises();

    expect(requests).toContainEqual(
      expect.objectContaining({
        url: 'http://localhost:3000/match-options',
      }),
    );
    expect(requests).toContainEqual(
      expect.objectContaining({
        url: 'http://localhost:3000/matches',
        method: 'POST',
        header: {
          Authorization: 'Bearer dev-token-13800138000',
        },
        data: {
          title: '静安寺白领馆 2号台 · 下班开打约球',
          venueId: 'venue-seed-2',
          courtId: 'venue-court-3',
          slotId: 'venue-slot-4',
          level: 'intermediate',
          maxPlayers: 2,
        },
      }),
    );

    expect(switchTab).toHaveBeenCalledWith({
      url: '/pages/profile/index',
    });
    expect(navigateTo).not.toHaveBeenCalled();
  });

  it('seeds a sensible default draft for quick posting', () => {
    const store = useMatchDraftStore();

    expect(store.level).toBe('intermediate');
    expect(store.maxPlayers).toBe(4);
    expect(store.city).toBe('上海');
    expect(store.venueId).toBe('venue-seed-1');
  });
});
