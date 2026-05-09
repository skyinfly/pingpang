import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia, setActivePinia } from 'pinia';
import MessagesPage from '../pages/messages/index.vue';
import { useAuthStore } from '../stores/auth';

describe('MessagesPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders persisted summary counts and message cards from the API', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();
    const navigateTo = vi.fn();

    vi.stubGlobal('uni', {
      request: ({
        url,
        success,
      }: {
        url: string;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        if (url.endsWith('/messages/summary')) {
          success({
            statusCode: 200,
            data: {
              unreadSystemCount: 2,
              unreadChatCount: 3,
              pendingInvitesCount: 1,
            },
          });
          return;
        }

        if (url.endsWith('/chat-threads')) {
          success({
            statusCode: 200,
            data: {
              items: [
                {
                  id: 'match-seed-1',
                  matchId: 'match-seed-1',
                  title: '徐汇晚间上分局',
                  venueName: '徐家汇活力馆 3 号台',
                  scheduledAt: '2026-04-18T11:00:00.000Z',
                  status: 'active',
                  hostUserId: 'user-reviewee-1',
                  latestMessagePreview: '我会提前 10 分钟到。',
                  latestMessageAt: '2026-04-18T10:40:00.000Z',
                  unreadCount: 3,
                  participantCount: 2,
                  lastReadAt: null,
                },
              ],
            },
          });
          return;
        }

        success({
          statusCode: 200,
          data: {
            items: [
              {
                id: 'message-seed-1',
                kind: 'system',
                title: '申请已通过',
                content: '你申请的徐汇晚间上分局已通过，可以准备进群沟通了。',
                status: 'approved',
                matchId: 'match-seed-1',
                isRead: false,
                createdAt: '2026-04-18T11:30:00.000Z',
              },
              {
                id: 'message-seed-2',
                kind: 'system',
                title: '申请暂未通过',
                content: '这场球局当前席位更适合其他安排，你可以换个时间段继续约。',
                status: 'rejected',
                matchId: 'match-seed-2',
                isRead: false,
                createdAt: '2026-04-18T12:00:00.000Z',
              },
            ],
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

    const wrapper = mount(MessagesPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('申请已通过');
      expect(wrapper.text()).toContain('申请暂未通过');
      expect(wrapper.text()).toContain('2');
      expect(wrapper.text()).toContain('3');
      expect(wrapper.text()).toContain('1');
      expect(wrapper.text()).toContain('已通过');
      expect(wrapper.text()).toContain('暂未通过');
    });

    await wrapper.get('[data-testid="message-card-message-seed-1"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/match-detail/index?id=match-seed-1',
    });

    await wrapper.get('[data-testid="message-action-message-seed-2"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/square/index',
    });

    await wrapper.get('[data-filter="chat"]').trigger('click');

    expect(wrapper.text()).toContain('徐汇晚间上分局');
    expect(wrapper.text()).toContain('我会提前 10 分钟到。');
    expect(wrapper.text()).toContain('徐家汇活力馆 3 号台');
    expect(wrapper.text()).toContain('3 条未读');
    expect(wrapper.text()).toContain('2 位球友');

    await wrapper.get('[data-testid="thread-card"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/chat/index?threadId=match-seed-1',
    });
  });

  it('shows a login guide instead of a blank dashboard when signed out', async () => {
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

    const wrapper = mount(MessagesPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('登录后查看消息和待处理申请');
      expect(wrapper.text()).toContain('去登录');
    });

    await wrapper.get('[data-testid="messages-login-entry"]').trigger('click');

    expect(navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/index?redirect=%2Fpages%2Fmessages%2Findex',
    });
  });
});
