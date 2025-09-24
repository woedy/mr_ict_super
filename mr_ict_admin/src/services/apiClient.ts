import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './tokenStorage';

const generateRequestId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `req-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const rawBase = (import.meta as any).env?.VITE_API_BASE || 'http://localhost:8000/api/';
const joinBasePath = (base: string, path?: string) => {
  if (!path) return base;
  if (/^https?:/i.test(path)) return path;
  const normalisedBase = base.replace(/\/+$/, '');
  const normalisedPath = path.replace(/^\/+/, '');
  return `${normalisedBase}/${normalisedPath}`;
};

const API_BASE = joinBasePath(rawBase, '');
const REFRESH_URL = joinBasePath(
  API_BASE,
  (import.meta as any).env?.VITE_AUTH_REFRESH_ENDPOINT || 'accounts/token/refresh/',
);

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

type RetriableConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _retryCount?: number;
  skipRetry?: boolean;
  requestId?: string;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  const requestConfig = config as RetriableConfig;
  requestConfig.headers = requestConfig.headers || {};
  requestConfig.requestId = requestConfig.requestId || generateRequestId();
  requestConfig.headers['X-Request-ID'] = requestConfig.requestId;

  if (token) {
    requestConfig.headers['Authorization'] = `Bearer ${token}`;
  }
  return requestConfig;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as RetriableConfig | undefined;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(REFRESH_URL, { refresh: refreshToken });
        const accessToken = refreshResponse.data?.access as string | undefined;
        if (!accessToken) {
          clearTokens();
          return Promise.reject(error);
        }

        setTokens(accessToken, refreshToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest as AxiosRequestConfig);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    const shouldRetry =
      originalRequest &&
      !originalRequest.skipRetry &&
      (error.code === 'ECONNABORTED' || !status || (status >= 500 && status < 600));

    if (shouldRetry) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      const maxRetries = 2;

      if (originalRequest._retryCount <= maxRetries) {
        const backoff = 200 * 2 ** (originalRequest._retryCount - 1);
        await sleep(backoff);
        return api(originalRequest as AxiosRequestConfig);
      }
    }

    return Promise.reject(error);
  },
);

export const resolveApiPath = (path: string) => joinBasePath(API_BASE, path);

export default api;
