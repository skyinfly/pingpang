type UniRequestOptions = {
  url: string;
  method?: string;
  data?: Record<string, unknown>;
  header?: Record<string, string>;
  success?: (response: { statusCode: number; data: unknown }) => void;
  fail?: (error: unknown) => void;
};

type WebPreviewUni = {
  request: typeof request;
  navigateTo(options: { url: string }): void;
  switchTab(options: { url: string }): void;
  getStorageSync(key: string): string;
  setStorageSync(key: string, value: string): void;
  removeStorageSync(key: string): void;
};

type WebPreviewGlobal = typeof globalThis & {
  uni?: WebPreviewUni;
};

function navigate(url: string) {
  const normalized = url.startsWith('/') ? url : `/${url}`;
  globalThis.location.hash = normalized;
}

function request(options: UniRequestOptions) {
  fetch(options.url, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.header ?? {}),
    },
    body: options.method && options.method !== 'GET' ? JSON.stringify(options.data ?? {}) : undefined,
  })
    .then(async (response) => {
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      options.success?.({ statusCode: response.status, data });
    })
    .catch((error) => {
      options.fail?.(error);
    });
}

export function ensureWebPreviewUni() {
  const runtime = globalThis as WebPreviewGlobal;

  if (typeof runtime.uni !== 'undefined') {
    return;
  }

  runtime.uni = {
    request,
    navigateTo({ url }: { url: string }) {
      navigate(url);
    },
    switchTab({ url }: { url: string }) {
      navigate(url);
    },
    getStorageSync(key: string) {
      return globalThis.localStorage.getItem(key) ?? '';
    },
    setStorageSync(key: string, value: string) {
      globalThis.localStorage.setItem(key, value);
    },
    removeStorageSync(key: string) {
      globalThis.localStorage.removeItem(key);
    },
  } satisfies WebPreviewUni;
}
