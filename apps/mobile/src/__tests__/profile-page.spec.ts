import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia, setActivePinia } from 'pinia';
import ProfilePage from '../pages/profile/index.vue';
import { useAuthStore } from '../stores/auth';

describe('ProfilePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders persisted profile credit and review tags from the API', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const navigateTo = vi.fn();
    const switchTab = vi.fn();

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/mine')) {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-hosted-1',
                  title: '我发起的徐汇晚场',
                  venueName: '徐家汇活力馆 6 号台',
                  startTime: '2026-04-22T19:30:00+08:00',
                  distanceKm: 1.2,
                  maxPlayers: 4,
                  openSlots: 2,
                  hostCreditScore: 100,
                  hostUserId: 'user-13800138000',
                  level: 'intermediate',
                  matchRate: 88,
                  city: '上海',
                  score: 70,
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/matches/joined')) {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-joined-1',
                  title: '我参加的静安午休局',
                  venueName: '静安寺白领馆 2 号台',
                  startTime: '2026-04-24T12:30:00+08:00',
                  distanceKm: 3.2,
                  maxPlayers: 4,
                  openSlots: 1,
                  hostCreditScore: 98,
                  hostUserId: 'user-reviewee-1',
                  level: 'intermediate',
                  matchRate: 84,
                  city: '上海',
                  score: 71,
                },
              ],
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            user: {
              id: 'user-13800138000',
              nickname: '球友1380013',
              city: '上海',
              level: 'intermediate',
              creditScore: 100,
            },
            stats: {
              totalReviews: 2,
              positiveReviews: 2,
              averageScore: 4.5,
            },
            tags: [
              { tag: 'on_time', count: 1 },
              { tag: 'great_communication', count: 1 },
            ],
            items: [
              {
                id: 'review-profile-seed-1',
                matchId: 'match-seed-1',
                reviewerId: 'user-reviewee-1',
                reviewerName: '球友里卡',
                revieweeId: 'user-13800138000',
                score: 5,
                tags: ['on_time', 'great_communication'],
                createdAt: '2026-04-17T13:30:00.000Z',
              },
            ],
          },
        });
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

    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('球友1380013');
      expect(wrapper.text()).toContain('100');
      expect(wrapper.text()).toContain('准时到场');
      expect(wrapper.text()).toContain('球友里卡');
      expect(wrapper.text()).toContain('信用分');
      expect(wrapper.text()).toContain('我发起的球局');
      expect(wrapper.text()).toContain('我参加的球局');
      expect(wrapper.text()).toContain('我发起的徐汇晚场');
      expect(wrapper.text()).toContain('我参加的静安午休局');
      expect(wrapper.text()).toContain('徐家汇活力馆 6 号台');
      expect(wrapper.text()).toContain('退出登录');
    });

    await wrapper.get('[data-testid="hosted-match-card"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/match-detail/index?id=match-hosted-1',
    });

    await wrapper.get('[data-testid="logout-action"]').trigger('click');

    expect(authStore.token).toBe('');
    expect(authStore.user).toBeNull();
    expect(switchTab).toHaveBeenCalledWith({
      url: '/pages/home/index',
    });
  });

  it('shows a login guide instead of fake loading copy when the user is signed out', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const navigateTo = vi.fn();

    vi.stubGlobal('uni', {
      request: vi.fn(),
      navigateTo,
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('登录后查看你的球局和信用档案');
      expect(wrapper.text()).toContain('去登录');
    });

    await wrapper.get('[data-testid="profile-login-entry"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index?redirect=%2Fpages%2Fprofile%2Findex',
    });
  });

  it('shows an expired-login hint instead of an empty joined list when joined matches are unauthorized', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/joined')) {
          success({
            statusCode: 401,
            data: {
              message: 'expired token',
            },
          });
          return;
        }

        if (url.endsWith('/matches/mine')) {
          success({
            statusCode: 200,
            data: { items: [] },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            user: {
              id: 'user-13800138000',
              nickname: '球友1380013',
              city: '上海',
              level: 'intermediate',
              creditScore: 100,
            },
            stats: {
              totalReviews: 0,
              positiveReviews: 0,
              averageScore: 0,
            },
            tags: [],
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

    authStore.setSession({
      token: 'expired-token',
      user: {
        id: 'user-13800138000',
        phone: '13800138000',
        nickname: '球友1380013',
        city: '上海',
        level: 'intermediate',
        creditScore: 100,
      },
    });

    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('登录状态已过期，请退出后重新登录');
      expect(wrapper.text()).not.toContain('你还没有通过审核的球局');
    });
  });

  it('marks hosted matches that have been cancelled with a tag', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/mine')) {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-hosted-cancel-1',
                  title: '已取消的徐汇晚场',
                  venueName: '徐家汇活力馆 6 号台',
                  startTime: '2099-04-22T19:30:00+08:00',
                  distanceKm: 1.2,
                  maxPlayers: 4,
                  openSlots: 0,
                  status: 'cancelled',
                  hostCreditScore: 100,
                  hostUserId: 'user-13800138000',
                  level: 'intermediate',
                  matchRate: 88,
                  city: '上海',
                  score: 70,
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        success({
          statusCode: 200,
          data: {
            user: {
              id: 'user-13800138000',
              nickname: '球友1380013',
              city: '上海',
              level: 'intermediate',
              creditScore: 100,
            },
            stats: { totalReviews: 0, positiveReviews: 0, averageScore: 0 },
            tags: [],
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

    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('已取消的徐汇晚场');
      expect(wrapper.text()).toContain('已取消');
      expect(wrapper.text()).toContain('球友会在消息中心看到通知');
    });
  });
});
