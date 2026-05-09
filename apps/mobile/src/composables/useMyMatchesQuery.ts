import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { listMyMatches } from '../services/api';

export function useMyMatchesQuery(userId: MaybeRefOrGetter<string>) {
  const activeUserId = computed(() => toValue(userId));

  return useQuery({
    queryKey: computed(() => ['my-matches', activeUserId.value]),
    enabled: computed(() => Boolean(activeUserId.value)),
    queryFn: () => listMyMatches(),
    staleTime: 15_000,
  });
}
