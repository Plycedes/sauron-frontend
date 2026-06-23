'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiClientError } from '../api/types';

export interface UseApiOptions {
    enabled?: boolean;
    deps?: unknown[];
}

export interface UseApiResult<T> {
    data: T | null;
    isLoading: boolean;
    error: ApiClientError | null;
    refetch: () => Promise<void>;
}

export function useApi<T>(
    fetcher: () => Promise<T>,
    options?: UseApiOptions,
): UseApiResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiClientError | null>(null);

    const requestIdRef = useRef(0);
    const isMountedRef = useRef(true);
    const enabled = options?.enabled ?? true;
    const deps = options?.deps ?? [];
    const fetcherRef = useRef(fetcher);

    // Stringify deps into a single key so the trigger effect's deps array
    // remains a static literal (avoids exhaustive-deps rule on spreads).
    const depsKey = useMemo(() => stableStringify(deps), [deps]);

    useEffect(() => {
        fetcherRef.current = fetcher;
    }, [fetcher]);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const refetch = useCallback(async (): Promise<void> => {
        const requestId = ++requestIdRef.current;
        // All setState calls live inside this async function. The trigger
        // effect only invokes refetch(); it never calls setState directly,
        // which keeps us clear of the set-state-in-effect rule.
        if (isMountedRef.current && requestIdRef.current === requestId) {
            setIsLoading(true);
            setError(null);
        }
        try {
            const result = await fetcherRef.current();
            if (isMountedRef.current && requestIdRef.current === requestId) {
                setData(result);
            }
        } catch (err) {
            if (isMountedRef.current && requestIdRef.current === requestId) {
                setError(err instanceof ApiClientError ? err : new ApiClientError('Unknown error', 0));
            }
        } finally {
            if (isMountedRef.current && requestIdRef.current === requestId) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!enabled) return;
        void refetch();
    }, [enabled, refetch, depsKey]);

    return { data, isLoading, error, refetch };
}

function stableStringify(value: unknown): string {
    if (value === null || typeof value !== 'object') {
        return JSON.stringify(value) ?? String(value);
    }
    if (Array.isArray(value)) {
        return `[${value.map(stableStringify).join(',')}]`;
    }
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
        a < b ? -1 : a > b ? 1 : 0,
    );
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`;
}
