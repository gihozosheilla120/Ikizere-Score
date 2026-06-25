import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from '../constants/config';
import { API_ENDPOINTS } from '../constants/api';
import { ApiError, ApiErrorResponse, ApiSuccessResponse } from '../types/api';
import { tokenStorage } from './tokenStorage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post<ApiSuccessResponse<{ tokens: { accessToken: string; refreshToken: string } }>>(
      `${API_BASE_URL}${API_ENDPOINTS.auth.refreshToken}`,
      { refreshToken },
      { timeout: API_TIMEOUT_MS }
    );

    const tokens = response.data.data?.tokens;
    if (!tokens) return null;

    await tokenStorage.setTokens(tokens);
    return tokens.accessToken;
  } catch {
    await tokenStorage.clearSession();
    return null;
  }
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes(API_ENDPOINTS.auth.refreshToken)
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    const message = error.response?.data?.message ?? error.message ?? 'Request failed';
    const statusCode = error.response?.status ?? 500;
    const errors = error.response?.data?.errors;

    return Promise.reject(new ApiError(message, statusCode, errors));
  }
);

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const response = await apiClient.get<ApiSuccessResponse<T>>(url, { params });
  return response.data.data as T;
}

export async function apiPost<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.post<ApiSuccessResponse<T>>(url, body);
  return response.data.data as T;
}

export async function apiPut<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.put<ApiSuccessResponse<T>>(url, body);
  return response.data.data as T;
}

export async function apiPatch<T>(url: string, body?: unknown): Promise<T> {
  const response = await apiClient.patch<ApiSuccessResponse<T>>(url, body);
  return response.data.data as T;
}

export async function apiDelete<T>(url: string): Promise<T> {
  const response = await apiClient.delete<ApiSuccessResponse<T>>(url);
  return response.data.data as T;
}
