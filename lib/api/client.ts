import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { ApiClientError, type ApiErrorResponse, type ApiResponse } from './types';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../auth/token';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

const apiClient = axios.create({
    baseURL,
    timeout: 15000,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
    __skipAuthRefresh?: boolean;
};

type RefreshResponse = ApiResponse<{
    accessToken: string;
    refreshToken?: string;
}>;

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalConfig = error.config as RetryableRequestConfig | undefined;

        if (originalConfig?.__skipAuthRefresh) {
            throw toApiClientError(error);
        }

        if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
            originalConfig._retry = true;

            const refreshToken = getRefreshToken();
            if (!refreshToken) {
                clearTokens();
                redirectToLogin();
                throw toApiClientError(error);
            }

            try {
                const refreshResponse = await apiClient.post<RefreshResponse>(
                    '/auth/refresh',
                    { refreshToken },
                    { __skipAuthRefresh: true } as RetryableRequestConfig,
                );

                const payload = refreshResponse.data;
                if (!payload.success) {
                    throw new ApiClientError(payload.message, refreshResponse.status, payload.errors);
                }

                setAccessToken(payload.data.accessToken);
                if (payload.data.refreshToken) {
                    setRefreshToken(payload.data.refreshToken);
                }

                originalConfig.headers.set('Authorization', `Bearer ${payload.data.accessToken}`);
                return apiClient(originalConfig);
            } catch (refreshError) {
                if (refreshError instanceof ApiClientError) {
                    clearTokens();
                    redirectToLogin();
                    throw refreshError;
                }
                if (refreshError instanceof AxiosError) {
                    clearTokens();
                    redirectToLogin();
                    throw toApiClientError(refreshError);
                }
                clearTokens();
                redirectToLogin();
                throw new ApiClientError('Session expired. Please sign in again.', 401);
            }
        }

        throw toApiClientError(error);
    },
);

function toApiClientError(error: AxiosError<ApiErrorResponse>): ApiClientError {
    if (error.response) {
        const data = error.response.data;
        const message = data?.message || error.message || 'Request failed';
        return new ApiClientError(message, error.response.status, data?.errors);
    }
    if (error.code === 'ECONNABORTED') {
        return new ApiClientError('Request timed out. Please try again.', 0);
    }
    return new ApiClientError(error.message || 'Network error', 0);
}

function redirectToLogin(): void {
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}

export default apiClient;