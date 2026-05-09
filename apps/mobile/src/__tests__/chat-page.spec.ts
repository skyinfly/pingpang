import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia, setActivePinia } from 'pinia';
import ChatPage from '../pages/chat/index.vue';
import { useAuthStore } from '../stores/auth';

describe('ChatPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('loads persisted chat messages and posts a new one', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    const requests: string[] = [];
    window.location.hash = '#/pages/chat/index?threadId=match-seed-1';

    vi.stubGlobal('uni', {
      request: ({
        url,
        method,
        data,
        success,
      }: {
        url: string;
        method?: string;
        data?: Record<string, unknown>;
        success: (response: { statusCode: number; data: unknown }) => void;
      }) => {
        requests.push(`${method ?? 'GET'} ${url}`);

        if (method === 'POST' && url.endsWith('/chat-threads/match-seed-1/read')) {
          success({ statusCode: 201, data: { threadId: 'match-seed-1', updatedCount: 3, lastReadAt: '2026-04-20T01:00:00.000Z' } });
          return;
        }

        if (method === 'POST' && url.endsWith('/chat-threads/match-seed-1/messages')) {
          success({
            statusCode: 201,
            data: {
              id: 'message-new-1',
              kind: 'chat',
              title: '徐汇晚间上分局',
              content: data?.content,
              senderId: 'user-13800138000',
              senderName: '球友1380013',
              isRead: false,
              matchId: 'match-seed-1',
              threadId: 'match-seed-1',
              createdAt: '2026-04-18T12:00:00.000Z',
            },
          });
          return;
        }

        if (url.endsWith('/chat-threads/match-seed-1')) {
          success({
            statusCode: 200,
            data: {
              thread: {
                id: 'match-seed-1',
                matchId: 'match-seed-1',
                title: '徐汇晚间上分局',
                venueName: '徐家汇活力馆 3 号台',
                scheduledAt: '2026-04-18T11:00:00.000Z',
                status: 'active',
                hostUserId: 'user-reviewee-1',
                latestMessagePreview: '我会提前 10 分钟到。',
                latestMessageAt: '2026-04-18T10:40:00.000Z',
                lastMessageSenderName: '球友1380013',
                unreadCount: 1,
                participantCount: 2,
                lastReadAt: null,
              },
              participants: [
                {
                  userId: 'user-reviewee-1',
                  nickname: '球友里卡',
                  city: '上海',
                  level: 'advanced',
                  role: 'host',
                  joinedAt: '2026-04-18T10:00:00.000Z',
                  lastReadAt: '2026-04-18T10:42:00.000Z',
                },
                {
                  userId: 'user-13800138000',
                  nickname: '球友1380013',
                  city: '上海',
                  level: 'intermediate',
                  role: 'member',
                  joinedAt: '2026-04-18T10:05:00.000Z',
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
            participantCount: 2,
            items: [
              {
                id: 'message-seed-3',
                kind: 'chat',
                title: '局内沟通',
                content: '我会提前 10 分钟到。',
                senderId: 'user-13800138000',
                senderName: '球友1380013',
                isRead: false,
                matchId: 'match-seed-1',
                threadId: 'match-seed-1',
                createdAt: '2026-04-18T10:40:00.000Z',
              },
            ],
          },
        });
      },
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

    const wrapper = mount(ChatPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('我会提前 10 分钟到。');
    });

    expect(wrapper.text()).toContain('局内聊天');
    expect(wrapper.text()).toContain('进行中');
    expect(wrapper.text()).toContain('徐汇晚间上分局');
    expect(wrapper.text()).toContain('徐家汇活力馆 3 号台');
    expect(wrapper.text()).toContain('球友里卡');
    expect(wrapper.get('[data-testid="chat-scroll"]')).toBeTruthy();
    expect(wrapper.get('[data-testid="chat-composer"]')).toBeTruthy();
    expect(wrapper.get('input').attributes('placeholder')).toBe('和球友说点什么...');
    expect(wrapper.get('button').text()).toContain('发送');

    await wrapper.get('input').setValue('我已经到楼下了。');
    await wrapper.get('button').trigger('click');

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('我已经到楼下了。');
    });

    expect(requests).toContain('POST http://localhost:3000/chat-threads/match-seed-1/read');
    expect(requests).toContain('GET http://localhost:3000/chat-threads/match-seed-1');
    expect(requests).toContain('POST http://localhost:3000/chat-threads/match-seed-1/messages');
  });

  it('shows clear guidance when the user opens chat without a thread id', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    const authStore = useAuthStore();

    vi.stubGlobal('uni', {
      request: vi.fn(),
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

    const wrapper = mount(ChatPage, {
      global: {
        plugins: [pinia, [VueQueryPlugin, { queryClient: new QueryClient() }]],
      },
    });

    await vi.waitFor(() => {
      expect(wrapper.text()).toContain('先从消息或球局详情进入聊天');
      expect(wrapper.text()).toContain('还没有选中聊天会话');
    });
  });
});
