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
};

export type AdminVenuePayload = {
  name: string;
  city: string;
  district?: string;
  distanceKm: number;
  isActive: boolean;
};

export type AdminUserPayload = {
  phone?: string;
  nickname?: string;
  city?: string;
  level?: string;
  creditScore?: number;
};

export type AdminCreateUserPayload = Required<AdminUserPayload>;

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
    getSummary: () => get<AdminSummary>('/admin/summary'),
    listMatches: () => get<{ items: AdminMatchRow[] }>('/admin/matches'),
    listUsers: () => get<{ items: AdminUserRow[] }>('/admin/users'),
    listVenues: () => get<{ items: AdminVenueRow[] }>('/admin/venues'),
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
  };
}

export function resolveAdminApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
}
