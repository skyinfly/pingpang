import { computed, type MaybeRefOrGetter, toValue } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { listHostedApplications } from '../services/api';

export function useHostedMatchApplicationsQuery(matchId: MaybeRefOrGetter<string>, enabled: MaybeRefOrGetter<boolean> = true) {
  const activeMatchId = computed(() => toValue(matchId));
  const isEnabled = computed(() => Boolean(toValue(enabled) && activeMatchId.value));

  return useQuery({
    queryKey: computed(() => ['hosted-match-applications', activeMatchId.value]),
    enabled: isEnabled,
    queryFn: () => listHostedApplications(activeMatchId.value),
    staleTime: 5_000,
  });
}
