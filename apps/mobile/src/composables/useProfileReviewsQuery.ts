import { computed, type MaybeRef, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';
export function useProfileReviewsQuery(userId: MaybeRef<string>) {
  const resolvedUserId = computed(() => toValue(userId));
  return useQuery({
    queryKey: computed(() => ['review-profile', resolvedUserId.value]),
    enabled: computed(() => Boolean(resolvedUserId.value)),
    queryFn: () => apiClient.fetchReviewProfile(resolvedUserId.value),
  });
}
