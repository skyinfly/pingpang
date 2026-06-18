import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia, setActivePinia } from 'pinia';
import MatchDetailPage from '../pages/match-detail/index.vue';
import { useAuthStore } from '../stores/auth';

describe('MatchDetailPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('shows login CTA and routes to login when user is not signed in', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const navigateTo = vi.fn();

    window.location.hash = '#/pages/match-detail/index?id=match-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        expect(url).toBe('http://localhost:3000/matches/match-seed-1');
        success({
          statusCode: 200,
          data: {
            id: 'match-seed-1',
            title: '徐汇晚间上分局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66.06,
            hostUserId: 'user-reviewee-1',
          },
        });
      },
      navigateTo,
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
    });

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('登录后加入');
      expect(wrapper.text()).toContain('徐汇晚间上分局');
    });

    await wrapper.get('[data-testid="join-match"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index?redirect=%2Fpages%2Fmatch-detail%2Findex%3Fid%3Dmatch-seed-1',
    });
  });

  it('applies to the match and updates CTA after a signed-in user joins', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: string[] = [];

    window.location.hash = '#/pages/match-detail/index?id=match-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        method,
        header,
        success,
      }: {
        url: string;
        method?: string;
        header?: Record<string, string>;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        requests.push(`${method ?? 'GET'} ${url}`);

        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/my-application')) {
          success({
            statusCode: 200,
            data: {
              status: 'none',
            },
          });
          return;
        }

        if (method === 'POST') {
          expect(header?.Authorization).toBe('Bearer dev-token-13800138000');
          success({
            statusCode: 201,
            data: {
              matchId: 'match-seed-1',
              userId: 'user-13800138000',
              status: 'pending',
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-seed-1',
            title: '徐汇晚间上分局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66.06,
            hostUserId: 'user-reviewee-1',
          },
        });
      },
      navigateTo: vi.fn(),
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('加入球局');
    });

    await wrapper.get('[data-testid="join-match"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('已申请，等待主理人确认');
    });

    expect(requests).toContain('GET http://localhost:3000/matches/match-seed-1');
    expect(requests).toContain('GET http://localhost:3000/matches/joined');
    expect(requests).toContain('POST http://localhost:3000/matches/match-seed-1/applications');
  });

  it('shows host application management when the current user opened their own match', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: string[] = [];

    window.location.hash = '#/pages/match-detail/index?id=match-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        method,
        success,
      }: {
        url: string;
        method?: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        requests.push(`${method ?? 'GET'} ${url}`);

        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/my-application')) {
          success({
            statusCode: 200,
            data: {
              status: 'none',
            },
          });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/applications') && method !== 'POST') {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'application-seed-1',
                  matchId: 'match-seed-1',
                  userId: 'user-reviewee-2',
                  status: 'pending',
                  applicantNickname: '球友阿周',
                  applicantCity: '上海',
                  applicantLevel: 'intermediate',
                  applicantCreditScore: 96,
                  createdAt: '2026-04-23T18:05:00.000Z',
                },
                {
                  id: 'application-seed-2',
                  matchId: 'match-seed-1',
                  userId: 'user-reviewee-3',
                  status: 'approved',
                  applicantNickname: '球友小林',
                  applicantCity: '上海',
                  applicantLevel: 'advanced',
                  applicantCreditScore: 99,
                  createdAt: '2026-04-23T18:10:00.000Z',
                },
                {
                  id: 'application-seed-3',
                  matchId: 'match-seed-1',
                  userId: 'user-reviewee-4',
                  status: 'rejected',
                  applicantNickname: '球友老方',
                  applicantCity: '上海',
                  applicantLevel: 'beginner',
                  applicantCreditScore: 94,
                  createdAt: '2026-04-23T18:12:00.000Z',
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/applications/application-seed-1/approve')) {
          success({
            statusCode: 201,
            data: {
              id: 'application-seed-1',
              matchId: 'match-seed-1',
              userId: 'user-reviewee-2',
              status: 'approved',
              applicantNickname: '球友阿周',
              applicantCity: '上海',
              applicantLevel: 'intermediate',
              applicantCreditScore: 96,
              createdAt: '2026-04-23T18:05:00.000Z',
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-seed-1',
            title: '徐汇晚间上分局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66.06,
            hostUserId: 'user-13800138000',
          },
        });
      },
      navigateTo: vi.fn(),
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('待你处理的申请');
      expect(wrapper.text()).toContain('球友阿周');
      expect(wrapper.text()).toContain('同意加入');
      expect(wrapper.text()).toContain('已加入的球友');
      expect(wrapper.text()).toContain('球友小林');
      expect(wrapper.text()).toContain('暂未通过的申请');
      expect(wrapper.text()).toContain('球友老方');
    });

    await wrapper.get('[data-testid="approve-application-application-seed-1"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('已同意加入');
    });

    expect(requests).toContain('GET http://localhost:3000/matches/match-seed-1/applications');
    expect(requests).toContain('POST http://localhost:3000/matches/match-seed-1/applications/application-seed-1/approve');
  });

  it('lets the host choose a rejection reason before rejecting an applicant', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: Array<{ url: string; method: string; data?: unknown }> = [];

    window.location.hash = '#/pages/match-detail/index?id=match-seed-1';

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
        requests.push({ url, method: method ?? 'GET', data });

        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/applications') && method !== 'POST') {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'application-seed-1',
                  matchId: 'match-seed-1',
                  userId: 'user-reviewee-2',
                  status: 'pending',
                  applicantNickname: '球友阿周',
                  applicantCity: '上海',
                  applicantLevel: 'intermediate',
                  applicantCreditScore: 96,
                  createdAt: '2026-04-23T18:05:00.000Z',
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/matches/match-seed-1/applications/application-seed-1/reject')) {
          success({
            statusCode: 201,
            data: {
              id: 'application-seed-1',
              matchId: 'match-seed-1',
              userId: 'user-reviewee-2',
              status: 'rejected',
              decisionReason: '这场局更适合中高级球友',
              applicantNickname: '球友阿周',
              applicantCity: '上海',
              applicantLevel: 'intermediate',
              applicantCreditScore: 96,
              createdAt: '2026-04-23T18:05:00.000Z',
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-seed-1',
            title: '徐汇晚间上分局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66.06,
            hostUserId: 'user-13800138000',
          },
        });
      },
      navigateTo: vi.fn(),
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('暂不通过');
    });

    await wrapper.get('[data-testid="reject-application-application-seed-1"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('这场局更适合中高级球友');
      expect(wrapper.text()).toContain('确认暂不通过');
    });

    await wrapper.get('[data-testid="reject-reason-option-1"]').trigger('click');
    await wrapper.get('[data-testid="confirm-reject-application-application-seed-1"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('暂未通过的申请');
      expect(wrapper.text()).toContain('这场局更适合中高级球友');
    });

    expect(requests).toContainEqual({
      url: 'http://localhost:3000/matches/match-seed-1/applications/application-seed-1/reject',
      method: 'POST',
      data: {
        reason: '这场局更适合中高级球友',
      },
    });
  });

  it('shows a joined-member CTA when the current user opened a match from joined matches', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const navigateTo = vi.fn();

    window.location.hash = '#/pages/match-detail/index?id=match-joined-1';

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
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-joined-1',
                  title: '我参加的静安午休局',
                  venueName: '静安寺白领馆 2 号台',
                  startTime: '2099-04-24T12:30:00+08:00',
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

        if (url.endsWith('/matches/match-joined-1/my-application')) {
          success({
            statusCode: 200,
            data: {
              status: 'approved',
              applicationId: 'application-joined-1',
              matchId: 'match-joined-1',
              userId: 'user-13800138000',
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-joined-1',
            title: '我参加的静安午休局',
            venueName: '静安寺白领馆 2 号台',
            startTime: '2099-04-24T12:30:00+08:00',
            distanceKm: 3.2,
            maxPlayers: 4,
            openSlots: 1,
            hostCreditScore: 98,
            level: 'intermediate',
            matchRate: 84,
            city: '上海',
            score: 71,
            hostUserId: 'user-reviewee-1',
          },
        });
      },
      navigateTo,
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('你已经加入这场球局');
      expect(wrapper.text()).toContain('去局内聊天');
    });

    await wrapper.get('[data-testid="join-match"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/chat/index?threadId=match-joined-1',
    });
  });

  it('shows a rejected application state instead of a join CTA', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const switchTab = vi.fn();

    window.location.hash = '#/pages/match-detail/index?id=match-rejected-1';

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
            statusCode: 200,
            data: {
              items: [],
            },
          });
          return;
        }

        if (url.endsWith('/matches/match-rejected-1/my-application')) {
          success({
            statusCode: 200,
            data: {
              status: 'rejected',
              applicationId: 'application-rejected-1',
              matchId: 'match-rejected-1',
              userId: 'user-13800138000',
              reason: '这场局更适合中高级球友',
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-rejected-1',
            title: '静安午休补位局',
            venueName: '静安寺白领馆 2号台',
            startTime: '2099-04-24T12:30:00+08:00',
            distanceKm: 3.2,
            maxPlayers: 4,
            openSlots: 1,
            hostCreditScore: 98,
            level: 'intermediate',
            matchRate: 84,
            city: '上海',
            score: 71,
            hostUserId: 'user-reviewee-1',
          },
        });
      },
      navigateTo: vi.fn(),
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('这次申请暂未通过');
      expect(wrapper.text()).toContain('去广场看看');
      expect(wrapper.text()).toContain('这场局更适合中高级球友');
    });

    await wrapper.get('[data-testid="join-match"]').trigger('click');

    expect(switchTab).toHaveBeenCalledWith({
      url: '/pages/square/index',
    });
  });

  it('renders a started-match state instead of join CTA when startTime is in the past', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    window.location.hash = '#/pages/match-detail/index?id=match-past-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-past-1/my-application')) {
          success({ statusCode: 200, data: { status: 'none' } });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-past-1',
            title: '昨天的练球局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2000-01-01T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66,
            hostUserId: 'user-reviewee-1',
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('球局已开打');
    });

    const cta = wrapper.get('[data-testid="join-match"]');
    expect((cta.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders a cancelled-match state when status is cancelled', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    window.location.hash = '#/pages/match-detail/index?id=match-cancelled-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-cancelled-1/my-application')) {
          success({ statusCode: 200, data: { status: 'none' } });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-cancelled-1',
            title: '已取消的练球局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-24T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 0,
            status: 'cancelled',
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66,
            hostUserId: 'user-reviewee-1',
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('球局已取消');
    });

    const cta = wrapper.get('[data-testid="join-match"]');
    expect((cta.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('renders a full-match state when openSlots is zero', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    window.location.hash = '#/pages/match-detail/index?id=match-full-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/matches/joined')) {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-full-1/my-application')) {
          success({ statusCode: 200, data: { status: 'none' } });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-full-1',
            title: '满员练球局',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2099-04-24T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 0,
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66,
            hostUserId: 'user-reviewee-1',
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('席位已满');
    });

    const cta = wrapper.get('[data-testid="join-match"]');
    expect((cta.element as HTMLButtonElement).disabled).toBe(true);
  });

  it('lets the host rate an approved member after the match has started', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: Array<{ url: string; method: string; data?: unknown }> = [];

    window.location.hash = '#/pages/match-detail/index?id=match-host-review-1';

    const matchPayload = {
      id: 'match-host-review-1',
      title: '上周末主理人评价测试',
      venueName: '徐家汇活力馆 3 号台',
      startTime: '2000-01-01T11:30:00.000Z',
      distanceKm: 1.8,
      maxPlayers: 4,
      openSlots: 2,
      status: 'open',
      hostCreditScore: 97,
      level: 'intermediate',
      matchRate: 93,
      city: '上海',
      score: 66,
      hostUserId: 'user-13800138000',
    };

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
        requests.push({ url, method: method ?? 'GET', data });

        if (url.endsWith('/matches/match-host-review-1/applications') && (method ?? 'GET') === 'GET') {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'application-host-review-1',
                  matchId: 'match-host-review-1',
                  userId: 'user-reviewee-9',
                  status: 'approved',
                  applicantNickname: '球友小新',
                  applicantCity: '上海',
                  applicantLevel: 'intermediate',
                  applicantCreditScore: 95,
                  createdAt: '2025-12-01T00:00:00.000Z',
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/reviews') && method === 'POST') {
          success({
            statusCode: 201,
            data: {
              review: {
                id: 'review-host-1',
                matchId: 'match-host-review-1',
                reviewerId: 'user-13800138000',
                revieweeId: 'user-reviewee-9',
                score: 5,
                tags: ['fair_play'],
                createdAt: '2025-12-01T00:00:00.000Z',
              },
              reviewee: { id: 'user-reviewee-9', creditScore: 96 },
            },
          });
          return;
        }

        success({ statusCode: 200, data: matchPayload });
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="approved-member-card-user-reviewee-9"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="member-review-stars-user-reviewee-9"]').exists()).toBe(true);
    });

    await wrapper.get('[data-testid="member-review-tag-user-reviewee-9-fair_play"]').trigger('click');
    await wrapper.get('[data-testid="submit-member-review-user-reviewee-9"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('球友信用分已经更新');
    });

    const reviewCall = requests.find((r) => r.url.endsWith('/reviews') && r.method === 'POST');
    expect(reviewCall?.data).toEqual({
      matchId: 'match-host-review-1',
      revieweeId: 'user-reviewee-9',
      score: 5,
      tags: ['fair_play'],
    });
  });

  it('lets a member submit a review after the match has started', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: Array<{ url: string; method: string; data?: unknown }> = [];

    window.location.hash = '#/pages/match-detail/index?id=match-past-host-1';

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
        requests.push({ url, method: method ?? 'GET', data });

        if (url.endsWith('/matches/joined')) {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-past-host-1',
                  title: '上周五的徐汇晚场',
                  venueName: '徐家汇活力馆 3 号台',
                  startTime: '2000-04-17T11:30:00.000Z',
                  distanceKm: 1.8,
                  maxPlayers: 4,
                  openSlots: 2,
                  status: 'open',
                  hostCreditScore: 97,
                  level: 'intermediate',
                  matchRate: 93,
                  city: '上海',
                  score: 66,
                  hostUserId: 'user-reviewee-1',
                },
              ],
            },
          });
          return;
        }

        if (url.endsWith('/matches/match-past-host-1/my-application')) {
          success({
            statusCode: 200,
            data: {
              status: 'approved',
              applicationId: 'application-past-1',
              matchId: 'match-past-host-1',
              userId: 'user-13800138000',
            },
          });
          return;
        }

        if (url.endsWith('/reviews/profile/user-reviewee-1')) {
          success({
            statusCode: 200,
            data: {
              user: {
                id: 'user-reviewee-1',
                nickname: '球友里卡',
                city: '上海',
                level: 'intermediate',
                creditScore: 97,
              },
              stats: { totalReviews: 0, positiveReviews: 0, averageScore: 0 },
              tags: [],
              items: [],
            },
          });
          return;
        }

        if (url.endsWith('/reviews') && method === 'POST') {
          success({
            statusCode: 201,
            data: {
              review: {
                id: 'review-new-1',
                matchId: 'match-past-host-1',
                reviewerId: 'user-13800138000',
                revieweeId: 'user-reviewee-1',
                score: 4,
                tags: ['on_time'],
                createdAt: '2025-12-01T00:00:00.000Z',
              },
              reviewee: { id: 'user-reviewee-1', creditScore: 98 },
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            id: 'match-past-host-1',
            title: '上周五的徐汇晚场',
            venueName: '徐家汇活力馆 3 号台',
            startTime: '2000-04-17T11:30:00.000Z',
            distanceKm: 1.8,
            maxPlayers: 4,
            openSlots: 2,
            status: 'open',
            hostCreditScore: 97,
            level: 'intermediate',
            matchRate: 93,
            city: '上海',
            score: 66,
            hostUserId: 'user-reviewee-1',
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="review-panel"]').exists()).toBe(true);
    });

    await wrapper.get('[data-testid="review-star-4"]').trigger('click');
    await wrapper.get('[data-testid="review-tag-on_time"]').trigger('click');
    await wrapper.get('[data-testid="submit-review"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="review-confirm"]').exists()).toBe(true);
    });

    const reviewCall = requests.find((r) => r.url.endsWith('/reviews') && r.method === 'POST');
    expect(reviewCall).toBeDefined();
    expect(reviewCall?.data).toEqual({
      matchId: 'match-past-host-1',
      revieweeId: 'user-reviewee-1',
      score: 4,
      tags: ['on_time'],
      anonymous: false,
    });
  });

  it('lets the host cancel their own match and flips the CTA to a cancelled state', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const requests: Array<{ url: string; method: string }> = [];

    window.location.hash = '#/pages/match-detail/index?id=match-host-cancel-1';

    const baseMatch = {
      id: 'match-host-cancel-1',
      title: '主理人取消测试局',
      venueName: '徐家汇活力馆 3 号台',
      startTime: '2099-04-24T11:30:00.000Z',
      distanceKm: 1.8,
      maxPlayers: 4,
      openSlots: 2,
      hostCreditScore: 97,
      level: 'intermediate',
      matchRate: 93,
      city: '上海',
      score: 66,
      hostUserId: 'user-13800138000',
    };

    vi.stubGlobal('uni', {
      request: ({
        url,
        method,
        success,
      }: {
        url: string;
        method?: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        requests.push({ url, method: method ?? 'GET' });

        if (url.endsWith('/matches/match-host-cancel-1/applications') && (method ?? 'GET') === 'GET') {
          success({ statusCode: 200, data: { items: [] } });
          return;
        }

        if (url.endsWith('/matches/match-host-cancel-1/cancel')) {
          success({
            statusCode: 201,
            data: { ...baseMatch, openSlots: 0, status: 'cancelled' },
          });
          return;
        }

        success({ statusCode: 200, data: baseMatch });
      },
      navigateTo: vi.fn(),
      switchTab: vi.fn(),
      setStorageSync: vi.fn(),
      getStorageSync: vi.fn(() => ''),
      removeStorageSync: vi.fn(),
      // The disband button now opens a confirmation modal before hitting
      // /cancel. Auto-confirm so the rest of the flow runs.
      showModal: vi.fn(({ success }: { success?: (res: { confirm: boolean }) => void }) => {
        success?.({ confirm: true });
      }),
      showToast: vi.fn(),
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

    const wrapper = mount(MatchDetailPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      // Copy updated: button now reads "解散约球" with a confirmation modal.
      expect(wrapper.text()).toContain('解散约球');
    });

    await wrapper.get('[data-testid="cancel-hosted-match"]').trigger('click');

    // Custom AppModal renders a confirm dialog before the cancel call;
    // click "confirm" to proceed.
    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="modal-confirm"]').exists()).toBe(true);
    });
    await wrapper.get('[data-testid="modal-confirm"]').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="cancel-hosted-match"]').exists()).toBe(false);
    });

    expect(
      requests.some((r) => r.url.endsWith('/matches/match-host-cancel-1/cancel') && r.method === 'POST'),
    ).toBe(true);
  });
});
