export function resolveApiBaseUrl(
  platform = import.meta.env.UNI_PLATFORM,
  envBaseUrl = import.meta.env.VITE_API_BASE_URL,
  platformBaseUrl = platform === 'mp-weixin'
    ? import.meta.env.VITE_API_BASE_URL_MP_WEIXIN
    : import.meta.env.VITE_API_BASE_URL_H5,
  mode = import.meta.env.MODE,
) {
  if (envBaseUrl) {
    if (platform === 'mp-weixin' && mode === 'production' && !envBaseUrl.startsWith('https://')) {
      throw new Error('VITE_API_BASE_URL_MP_WEIXIN must be an HTTPS URL for production mp-weixin builds');
    }

    return envBaseUrl;
  }

  if (platformBaseUrl) {
    if (platform === 'mp-weixin' && mode === 'production' && !platformBaseUrl.startsWith('https://')) {
      throw new Error('VITE_API_BASE_URL_MP_WEIXIN must be an HTTPS URL for production mp-weixin builds');
    }

    return platformBaseUrl;
  }

  if (platform === 'mp-weixin') {
    if (mode === 'production') {
      throw new Error('VITE_API_BASE_URL_MP_WEIXIN must be an HTTPS URL for production mp-weixin builds');
    }

    return 'http://127.0.0.1:3000';
  }

  return 'http://localhost:3000';
}

const BASE_URL = resolveApiBaseUrl();

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export function http<T>(url: string, options: RequestOptions = {}) {
  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url}`,
      method: (options.method ?? 'GET') as 'GET' | 'POST' | 'PUT' | 'DELETE',
      data: options.data,
      header: options.headers ?? {},
      success: (response) => {
        if (response.statusCode && response.statusCode >= 400) {
          reject(response);
          return;
        }

        resolve(response.data as T);
      },
      fail: reject,
    });
  });
}
