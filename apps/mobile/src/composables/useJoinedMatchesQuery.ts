import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { listJoinedMatches } from '../services/api';

export function useJoinedMatchesQuery(userId: MaybeRefOrGetter<string>) {
  const activeUserId = computed(() => toValue(userId));

  return useQuery({
    queryKey: computed(() => ['joined-matches', activeUserId.value]),
    enabled: computed(() => Boolean(activeUserId.value)),
    queryFn: () => listJoinedMatches(),
    retry: false,
    staleTime: 15_000,
  });
}
