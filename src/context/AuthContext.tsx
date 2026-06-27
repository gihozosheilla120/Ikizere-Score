import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { queryClient } from '../hooks/queryClient';
import { authService } from '../services/authService';
import type { LoginPayload, RegisterPayload } from '@/types/models';
import { tokenStorage } from '../services/tokenStorage';
import type { User } from '@/types/models';

export type AuthStatus = 'loading' | 'unauthenticated' | 'account_created' | 'authenticated';

interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  isAuthenticated: boolean;
  signIn: (payload: LoginPayload) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  completeRegistration: () => void;
  signOut: () => Promise<void>;
  refreshUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const restoredUser = await authService.restoreSession();
        if (!mounted) return;
        setUser(restoredUser);
        setStatus(restoredUser ? 'authenticated' : 'unauthenticated');
      } catch {
        if (!mounted) return;
        await tokenStorage.clearSession();
        setUser(null);
        setStatus('unauthenticated');
      }
    }

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = useCallback(async (payload: LoginPayload) => {
    const session = await authService.login(payload);
    setUser(session.user);
    setStatus('authenticated');
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const session = await authService.register(payload);
    setUser(session.user);
    setStatus('account_created');
  }, []);

  const completeRegistration = useCallback(() => {
    setStatus('authenticated');
  }, []);

  const signOut = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setStatus('unauthenticated');
    queryClient.clear();
  }, []);

  const refreshUser = useCallback(async (nextUser: User) => {
    await tokenStorage.setUser(nextUser);
    setUser(nextUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      signIn,
      signUp,
      completeRegistration,
      signOut,
      refreshUser,
    }),
    [status, user, signIn, signUp, completeRegistration, signOut, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
