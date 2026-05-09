import { computed, unref, type MaybeRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';

type MatchFilters = {
  city?: string;
  level?: string;
};

export function useMatchesQuery(filters: MaybeRef<MatchFilters> = { city: 'ÉÏº£', level: 'intermediate' }) {
  const resolvedFilters = computed(() => unref(filters));
  const queryKey = computed(() => ['matches', resolvedFilters.value.city ?? '', resolvedFilters.value.level ?? '']);

  return useQuery({
    queryKey,
    queryFn: () => apiClient.listMatches(resolvedFilters.value),
  });
}
