import { computed } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';

export function useMessagesQuery(currentUserId: () => string) {
  const resolvedUserId = computed(() => currentUserId());

  return useQuery({
    queryKey: computed(() => ['message-center', resolvedUserId.value]),
    enabled: computed(() => Boolean(resolvedUserId.value)),
    queryFn: async () => {
      const [summary, messages, threads] = await Promise.all([
        apiClient.fetchMessageSummary(),
        apiClient.listMessages(),
        apiClient.listChatThreads(),
      ]);

      return {
        summary,
        items: messages.items,
        threads: threads.items,
      };
    },
  });
}
