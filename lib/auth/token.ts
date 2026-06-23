const ACCESS_TOKEN_KEY = 'pulseiq.access_token';
const REFRESH_TOKEN_KEY = 'pulseiq.refresh_token';

function hasStorage(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getAccessToken(): string | null {
    if (!hasStorage()) return null;
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
    if (!hasStorage()) return;
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
    if (!hasStorage()) return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
    if (!hasStorage()) return;
    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function clearTokens(): void {
    if (!hasStorage()) return;
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
}