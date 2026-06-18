import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';

export function useChatMessagesQuery(options: {
  userId: () => string;
  threadId: () => string;
}) {
  const resolvedUserId = computed(() => options.userId());
  const resolvedThreadId = computed(() => options.threadId());

  return useQuery({
    queryKey: computed(() => ['chat-messages', resolvedUserId.value, resolvedThreadId.value]),
    enabled: computed(() => Boolean(resolvedUserId.value && resolvedThreadId.value)),
    refetchInterval: 5_000,
    refetchIntervalInBackground: false,
    // Mirror useThreadDetailQuery's retry policy — 4xx is permanent.
    retry: (failureCount, error: unknown) => {
      const status = (error as { statusCode?: number } | null)?.statusCode;
      if (status && status >= 400 && status < 500) return false;
      return failureCount < 2;
    },
    queryFn: async () => {
      const response = await apiClient.listThreadMessages(resolvedThreadId.value);
      return response;
    },
  });
}
