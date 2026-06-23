import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";
import type { ApiResponse } from "../types";
import { setAccessToken, setRefreshToken, clearTokens } from "../../auth/token";
import type { LoginInput, RegisterInput, UserResponse } from "@/types/user.types";

interface AuthSuccessPayload {
	user: UserResponse;
	accessToken: string;
	refreshToken: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthSuccessPayload> {
	const response = await apiClient.post<ApiResponse<AuthSuccessPayload>>(ENDPOINTS.auth.register, input);
	const payload = response.data;
	if (!payload.success) {
		throw new Error(payload.message);
	}
	setAccessToken(payload.data.accessToken);
	setRefreshToken(payload.data.refreshToken);
	return payload.data;
}

export async function loginUser(input: LoginInput): Promise<AuthSuccessPayload> {
	const response = await apiClient.post<ApiResponse<AuthSuccessPayload>>(ENDPOINTS.auth.login, input);
	const payload = response.data;
	if (!payload.success) {
		throw new Error(payload.message);
	}
	console.log(payload);
	setAccessToken(payload.data.accessToken);
	setRefreshToken(payload.data.refreshToken);
	return payload.data;
}

export async function logoutUser(): Promise<void> {
	await apiClient.post(ENDPOINTS.auth.logout);
	clearTokens();
}

export async function getCurrentUser(): Promise<UserResponse> {
	const response = await apiClient.get<ApiResponse<UserResponse>>(ENDPOINTS.auth.me);
	const payload = response.data;
	if (!payload.success) {
		throw new Error(payload.message);
	}
	return payload.data;
}
