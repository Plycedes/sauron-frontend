"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import * as authService from "@/lib/api/services/auth.service";
import { clearTokens, getAccessToken, setAccessToken, setRefreshToken } from "./token";
import type { LoginInput, RegisterInput, UserResponse } from "@/types/user.types";

export interface AuthContextValue {
	user: UserResponse | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	login: (input: LoginInput) => Promise<void>;
	register: (input: RegisterInput) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const router = useRouter();

	useEffect(() => {
		let cancelled = false;
		const hydrate = async () => {
			if (!getAccessToken()) {
				if (!cancelled) setIsLoading(false);
				return;
			}
			try {
				const me = await authService.getCurrentUser();
				if (!cancelled) setUser(me);
			} catch {
				clearTokens();
				if (!cancelled) setUser(null);
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

		console.log(user);

		setUser(result.user);
		// Dashboard page arrives in a future chat; this redirect will 404 until then.
		router.push("/dashboard");
	};

	const register = async (input: RegisterInput): Promise<void> => {
		const result = await authService.registerUser(input);
		setAccessToken(result.accessToken);
		setRefreshToken(result.refreshToken);
		setUser(result.user);
		// Dashboard page arrives in a future chat; this redirect will 404 until then.
		router.push("/dashboard");
	};

	const logout = async (): Promise<void> => {
		try {
			await authService.logoutUser();
		} catch {
			// Swallow: logout must succeed client-side regardless of backend state.
		}
		clearTokens();
		setUser(null);
		router.push("/login");
	};

	const value: AuthContextValue = {
		user,
		isLoading,
		isAuthenticated: user !== null,
		login,
		register,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (ctx === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return ctx;
}
