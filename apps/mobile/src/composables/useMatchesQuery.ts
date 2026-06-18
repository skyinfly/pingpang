import { computed, unref, type MaybeRef } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { apiClient } from '../services/api';
import { useLocationStore } from '../stores/location';

type MatchFilters = {
  city?: string;
  level?: string;
  /** Optional radius cap (km). When omitted the server returns all matches. */
  radiusKm?: number;
};

/**
 * Discover-feed query. Reactively re-fires when filters OR the user's
 * cached location change (e.g. after the location prompt resolves), so a
 * first-paint without coords and a second paint with coords both render
 * without callers having to orchestrate refetch manually.
 */
export function useMatchesQuery(filters: MaybeRef<MatchFilters> = {}) {
  const resolvedFilters = computed(() => unref(filters));
  const location = useLocationStore();
  // Fire-and-forget: warm the cache on first use. Callers can also call
  // location.ensure() explicitly to await the prompt.
  void location.ensure();

  const queryKey = computed(() => [
    'matches',
    resolvedFilters.value.city ?? '',
    resolvedFilters.value.level ?? '',
    resolvedFilters.value.radiusKm ?? '',
    location.lat ?? '',
    location.lng ?? '',
  ]);

  return useQuery({
    queryKey,
    queryFn: () =>
      apiClient.listMatches({
        ...resolvedFilters.value,
        lat: location.lat ?? undefined,
        lng: location.lng ?? undefined,
      }),
  });
}
