const rawBaseUrl = import.meta.env.VITE_API_URL || "";
const BASE_URL = rawBaseUrl.endsWith("/")
  ? rawBaseUrl.slice(0, -1)
  : rawBaseUrl;

export function apiFetch(path, options) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${BASE_URL}${normalizedPath}`;
  return fetch(url, options);
}
