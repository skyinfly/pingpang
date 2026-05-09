export type WebPreviewRoute = {
  path: string;
  query: Record<string, string>;
  fullPath: string;
};

function parseQuery(search: string) {
  const params = new URLSearchParams(search);
  return Object.fromEntries(params.entries());
}

export function getWebPreviewRoute(hash = globalThis.location?.hash ?? ''): WebPreviewRoute {
  const normalized = hash.startsWith('#') ? hash.slice(1) : hash;
  const [pathPart, queryPart = ''] = normalized.split('?');
  const path = pathPart || '/pages/home/index';

  return {
    path,
    query: parseQuery(queryPart),
    fullPath: `${path}${queryPart ? `?${queryPart}` : ''}`,
  };
}