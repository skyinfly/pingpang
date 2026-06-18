import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';

export function useThreadDetailQuery(options: {
  userId: () => string;
  threadId: () => string;
}) {
  const resolvedUserId = computed(() => options.userId());
  const resolvedThreadId = computed(() => options.threadId());

  return useQuery({
    queryKey: computed(() => ['chat-thread-detail', resolvedUserId.value, resolvedThreadId.value]),
    enabled: computed(() => Boolean(resolvedUserId.value && resolvedThreadId.value)),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
    // 403 ("not a member") is a permanent answer — don't burn 3 retries
    // before the chat page can surface its access-denied empty state.
    retry: (failureCount, error: unknown) => {
      const status = (error as { statusCode?: number } | null)?.statusCode;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
    queryFn: async () => apiClient.fetchChatThreadDetail(resolvedThreadId.value),
  });
}
