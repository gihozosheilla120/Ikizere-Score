import { API_ENDPOINTS } from '../constants/api';
import { apiPost } from './apiClient';
import { tokenStorage } from './tokenStorage';
import type {
  AuthSession,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  User,
} from '@/types/models';

export type { LoginPayload, RegisterPayload, ResetPasswordPayload };

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthSession> {
    const data = await apiPost<AuthSession>(API_ENDPOINTS.auth.register, payload);
    await tokenStorage.setTokens(data.tokens);
    await tokenStorage.setUser(data.user);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthSession> {
    const data = await apiPost<AuthSession>(API_ENDPOINTS.auth.login, payload);
    await tokenStorage.setTokens(data.tokens);
    await tokenStorage.setUser(data.user);
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiPost(API_ENDPOINTS.auth.logout);
    } finally {
      await tokenStorage.clearSession();
    }
  },

  async forgotPassword(email: string): Promise<void> {
    await apiPost(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  async resetPassword(payload: ResetPasswordPayload): Promise<AuthSession> {
    const data = await apiPost<AuthSession>(API_ENDPOINTS.auth.resetPassword, payload);
    await tokenStorage.setTokens(data.tokens);
    await tokenStorage.setUser(data.user);
    return data;
  },

  async restoreSession(): Promise<User | null> {
    const [accessToken, user] = await Promise.all([
      tokenStorage.getAccessToken(),
      tokenStorage.getUser(),
    ]);

    if (!accessToken || !user) {
      await tokenStorage.clearSession();
      return null;
    }

    return user;
  },
};
