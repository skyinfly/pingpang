export type AdminSummary = {
  users: number;
  matches: number;
  pendingApplications: number;
  activeVenues: number;
  unreadMessages: number;
  reviews: number;
};

export type AdminMatchRow = {
  id: string;
  title: string;
  venueName: string;
  city: string;
  level: string;
  maxPlayers: number;
  openSlots: number;
  status: 'open' | 'cancelled';
  startTime: string;
  hostUserId: string;
  hostNickname: string;
  hostPhone: string;
  applicationCounts: {
    pending: number;
    approved: number;
    rejected: number;
  };
};

export type AdminUserRow = {
  id: string;
  phone: string;
  nickname: string;
  city: string;
  level: string;
  creditScore: number;
  createdAt: string;
  hostedMatches: number;
  joinedMatches: number;
};

export type AdminVenueCourt = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type AdminVenueSlot = {
  id: string;
  label: string;
  startTime: number;
  endTime: number;
  sortOrder: number;
  isActive: boolean;
};

export type AdminVenueRow = {
  id: string;
  name: string;
  city: string;
  district: string | null;
  distanceKm: number;
  isActive: boolean;
  courtCount: number;
  slotCount: number;
  matchCount: number;
  courts: AdminVenueCourt[];
  slots: AdminVenueSlot[];
};

export type AdminVenuePayload = {
  name: string;
  city: string;
  district?: string;
  distanceKm: number;
  isActive: boolean;
};

export type AdminCourtPayload = {
  name?: string;
  sortOrder?: number;
  isActive?: boolean;
};

export type AdminSlotPayload = {
  label?: string;
  startTime?: string | number;
  endTime?: string | number;
  sortOrder?: number;
  isActive?: boolean;
};

export type AdminUserPayload = {
  phone?: string;
  nickname?: string;
  city?: string;
  level?: string;
  creditScore?: number;
};

export type AdminCreateUserPayload = Required<AdminUserPayload>;

export type AnalyticsOverview = {
  totals: {
    users: number;
    matches: number;
    applications: number;
    reviews: number;
    reports: number;
    openReports: number;
  };
  growth: {
    newUsers7d: number;
    newUsers30d: number;
    newUsersDelta: number;
    newMatches7d: number;
    newMatches30d: number;
    newMatchesDelta: number;
    cancelledMatches30d: number;
  };
  operations: {
    approvalRate: number;
    approvedApplications: number;
    rejectedApplications: number;
    averageReviewScore: number;
    averageCreditScore: number;
  };
};

export type AnalyticsBucket = { date: string; count: number };
export type AnalyticsTimeline = { days: number; buckets: AnalyticsBucket[] };

export type AnalyticsTopVenue = {
  venueId: string;
  venueName: string;
  district: string | null;
  matchCount: number;
};

export type AnalyticsTopHost = {
  hostUserId: string;
  hostNickname: string;
  hostPhone: string;
  creditScore: number;
  hostedMatches: number;
};

export type AdminReportRow = {
  id: string;
  reporterId: string;
  reporterNickname: string;
  targetUserId: string;
  targetNickname: string;
  targetPhone: string;
  matchId: string | null;
  reason: string;
  status: 'open' | 'reviewed' | 'dismissed';
  createdAt: string;
};

export type AdminReviewRow = {
  id: string;
  matchId: string;
  matchTitle: string;
  matchVenueName: string;
  matchStartTime: string | null;
  reviewerId: string;
  reviewerNickname: string;
  reviewerPhone: string;
  revieweeId: string;
  revieweeNickname: string;
  revieweePhone: string;
  revieweeCreditScore: number;
  score: number;
  tags: string[];
  createdAt: string;
};

export type AdminApplicationRow = {
  id: string;
  matchId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  decisionReason?: string;
  matchTitle: string;
  matchVenueName: string;
  matchStartTime: string;
  matchOpenSlots: number;
  matchMaxPlayers: number;
  hostUserId: string;
  hostNickname: string;
  hostPhone: string;
  applicantNickname: string;
  applicantPhone: string;
  applicantCity: string;
  applicantLevel: string;
  applicantCreditScore: number;
};

export type AdminMatchPayload = {
  title?: string;
  hostUserId?: string;
  venueId?: string;
  courtId?: string;
  slotId?: string;
  level?: string;
  maxPlayers?: number;
};

type FetchLike = typeof fetch;

type AdminApiClientOptions = {
  baseUrl: string;
  tokenProvider: () => string;
  fetchImpl?: FetchLike;
};

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('后台访问令牌无效，请重新填写');
    }

    throw new Error('后台数据请求失败，请稍后重试');
  }

  return response.json() as Promise<T>;
}

export function createAdminApiClient(options: AdminApiClientOptions) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const baseUrl = options.baseUrl.replace(/\/$/, '');

  async function get<T>(path: string) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      headers: {
        'X-Admin-Token': options.tokenProvider(),
      },
    });

    return readJson<T>(response as Response);
  }

  async function send<T>(method: 'POST' | 'PATCH', path: string, payload: unknown) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-Token': options.tokenProvider(),
      },
      body: JSON.stringify(payload),
    });

    return readJson<T>(response as Response);
  }

  async function remove(path: string) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': options.tokenProvider(),
      },
    });

    return readJson<{ ok: true; id: string }>(response as Response);
  }

  return {
    login: (payload: Record<string, string>) => send<{ token: string }>('POST', '/admin/login', payload),
    getSummary: () => get<AdminSummary>('/admin/summary'),
    listMatches: (search = '', page = 1, pageSize = 20) =>
      get<{ items: AdminMatchRow[]; total: number; page: number; pageSize: number }>(
        `/admin/matches?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      ),
    listUsers: (search = '', page = 1, pageSize = 20) =>
      get<{ items: AdminUserRow[]; total: number; page: number; pageSize: number }>(
        `/admin/users?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      ),
    listVenues: (search = '', page = 1, pageSize = 20) =>
      get<{ items: AdminVenueRow[]; total: number; page: number; pageSize: number }>(
        `/admin/venues?page=${page}&pageSize=${pageSize}${search ? `&search=${encodeURIComponent(search)}` : ''}`
      ),
    createVenue: (payload: AdminVenuePayload) => send<AdminVenueRow>('POST', '/admin/venues', payload),
    updateVenue: (id: string, payload: Partial<AdminVenuePayload>) =>
      send<AdminVenueRow>('PATCH', `/admin/venues/${id}`, payload),
    deleteVenue: (id: string) => remove(`/admin/venues/${id}`),
    createUser: (payload: AdminCreateUserPayload) => send<AdminUserRow>('POST', '/admin/users', payload),
    updateUser: (id: string, payload: AdminUserPayload) => send<AdminUserRow>('PATCH', `/admin/users/${id}`, payload),
    deleteUser: (id: string) => remove(`/admin/users/${id}`),
    createMatch: (payload: Required<AdminMatchPayload>) => send<AdminMatchRow>('POST', '/admin/matches', payload),
    updateMatch: (id: string, payload: AdminMatchPayload) => send<AdminMatchRow>('PATCH', `/admin/matches/${id}`, payload),
    deleteMatch: (id: string) => remove(`/admin/matches/${id}`),
    cancelMatch: (id: string, reason?: string) =>
      send<AdminMatchRow>('POST', `/admin/matches/${id}/cancel`, reason ? { reason } : {}),
    createCourt: (venueId: string, payload: Required<Pick<AdminCourtPayload, 'name'>> & AdminCourtPayload) =>
      send<AdminVenueRow>('POST', `/admin/venues/${venueId}/courts`, payload),
    updateCourt: (courtId: string, payload: AdminCourtPayload) =>
      send<AdminVenueRow>('PATCH', `/admin/courts/${courtId}`, payload),
    deleteCourt: (courtId: string) => removeReturning<AdminVenueRow>(`/admin/courts/${courtId}`),
    createSlot: (
      venueId: string,
      payload: Required<Pick<AdminSlotPayload, 'label' | 'startTime' | 'endTime'>> & AdminSlotPayload,
    ) => send<AdminVenueRow>('POST', `/admin/venues/${venueId}/slots`, payload),
    updateSlot: (slotId: string, payload: AdminSlotPayload) =>
      send<AdminVenueRow>('PATCH', `/admin/slots/${slotId}`, payload),
    deleteSlot: (slotId: string) => removeReturning<AdminVenueRow>(`/admin/slots/${slotId}`),
    listApplications: (status: 'pending' | 'approved' | 'rejected' = 'pending', page: number = 1, pageSize: number = 20) =>
      get<{ items: AdminApplicationRow[]; total: number; page: number; pageSize: number }>(`/admin/applications?status=${status}&page=${page}&pageSize=${pageSize}`),
    approveApplication: (applicationId: string) =>
      send<{ items: AdminApplicationRow[]; total: number; page: number; pageSize: number }>('POST', `/admin/applications/${applicationId}/approve`, undefined),
    rejectApplication: (applicationId: string, decisionReason?: string) =>
      send<{ items: AdminApplicationRow[]; total: number; page: number; pageSize: number }>('POST', `/admin/applications/${applicationId}/reject`, { decisionReason }),
    listReviews: (filters: { revieweeId?: string; reviewerId?: string; minScore?: number; maxScore?: number; page?: number; pageSize?: number } = {}) => {
      const query = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      return get<{ items: AdminReviewRow[]; total: number; page: number; pageSize: number }>(query ? `/admin/reviews?${query}` : '/admin/reviews');
    },
    deleteReview: (reviewId: string) => remove(`/admin/reviews/${reviewId}`),
    listReports: (filters: { status?: string; page?: number; pageSize?: number } = {}) => {
      const query = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
        .join('&');
      return get<{ items: AdminReportRow[]; page: number; pageSize: number; total: number }>(
        query ? `/admin/reports?${query}` : '/admin/reports',
      );
    },
    resolveReport: (reportId: string, status: 'reviewed' | 'dismissed') =>
      send<{ ok: true; id: string; status: string }>('POST', `/admin/reports/${reportId}/resolve`, { status }),
    getAnalyticsOverview: () => get<AnalyticsOverview>('/admin/analytics/overview'),
    getMatchTimeline: (days = 14) => get<AnalyticsTimeline>(`/admin/analytics/match-timeline?days=${days}`),
    getUserTimeline: (days = 14) => get<AnalyticsTimeline>(`/admin/analytics/user-timeline?days=${days}`),
    getTopVenues: (limit = 5) => get<{ items: AnalyticsTopVenue[] }>(`/admin/analytics/top-venues?limit=${limit}`),
    getTopHosts: (limit = 5) => get<{ items: AnalyticsTopHost[] }>(`/admin/analytics/top-hosts?limit=${limit}`),
  };

  async function removeReturning<T>(path: string) {
    const response = await fetchImpl(`${baseUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': options.tokenProvider(),
      },
    });

    return readJson<T>(response as Response);
  }
}

export function resolveAdminApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
}
