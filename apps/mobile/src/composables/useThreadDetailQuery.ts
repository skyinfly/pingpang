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
    queryFn: async () => apiClient.fetchChatThreadDetail(resolvedThreadId.value),
  });
}
