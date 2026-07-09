'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import * as authService from '@/lib/api/services/auth.service';
import * as userService from '@/lib/api/services/user.service';
import { clearTokens, getAccessToken, setAccessToken, setRefreshToken } from './token';
import type { LoginInput, RegisterInput, UserResponse } from '@/types/user.types';
import type { CompanyResponse } from '@/types/company.types';

export interface AuthContextValue {
  user: UserResponse | null;
  companies: CompanyResponse[];
  activeCompany: CompanyResponse | null;
  setActiveCompany: (company: CompanyResponse) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshCompanies: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [companies, setCompanies] = useState<CompanyResponse[]>([]);
  const [activeCompany, setActiveCompany] = useState<CompanyResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshCompanies = useCallback(async () => {
    try {
      const result = await userService.getMyCompanies();
      setCompanies(result);
      // Only auto-select if no company is currently active
      setActiveCompany((prev) => prev ?? result[0] ?? null);
    } catch {
      setCompanies([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      if (!getAccessToken()) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const [me, myCompanies] = await Promise.all([
          authService.getCurrentUser(),
          userService.getMyCompanies(),
        ]);
        if (!cancelled) {
          setUser(me);
          setCompanies(myCompanies);
          setActiveCompany(myCompanies[0] ?? null);
        }
      } catch {
        clearTokens();
        if (!cancelled) {
          setUser(null);
          setCompanies([]);
          setActiveCompany(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (input: LoginInput): Promise<void> => {
    const result = await authService.loginUser(input);
    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    setUser(result.user);
    const myCompanies = await userService.getMyCompanies().catch(() => []);
    setCompanies(myCompanies);
    setActiveCompany(myCompanies[0] ?? null);
    router.push('/dashboard');
  };

  const register = async (input: RegisterInput): Promise<void> => {
    const result = await authService.registerUser(input);
    setAccessToken(result.accessToken);
    setRefreshToken(result.refreshToken);
    setUser(result.user);
    setCompanies([]);
    setActiveCompany(null);
    router.push('/dashboard');
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logoutUser();
    } catch {
      // Swallow: logout must succeed client-side regardless of backend state.
    }
    clearTokens();
    setUser(null);
    setCompanies([]);
    setActiveCompany(null);
    router.push('/login');
  };

  const value: AuthContextValue = {
    user,
    companies,
    activeCompany,
    setActiveCompany,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshCompanies,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
