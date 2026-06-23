'use client';

import { useCallback, useState } from 'react';
import { ApiClientError } from '../api/types';

export interface UseMutationResult<TData, TVariables> {
    mutate: (variables: TVariables) => Promise<TData>;
    isLoading: boolean;
    error: ApiClientError | null;
    data: TData | null;
    reset: () => void;
}

export function useMutation<TData, TVariables = void>(
    mutationFn: (variables: TVariables) => Promise<TData>,
): UseMutationResult<TData, TVariables> {
    const [data, setData] = useState<TData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<ApiClientError | null>(null);

    const mutate = useCallback(
        async (variables: TVariables): Promise<TData> => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await mutationFn(variables);
                setData(result);
                return result;
            } catch (err) {
                const normalized = err instanceof ApiClientError ? err : new ApiClientError('Unknown error', 0);
                setError(normalized);
                throw normalized;
            } finally {
                setIsLoading(false);
            }
        },
        [mutationFn],
    );

    const reset = useCallback(() => {
        setData(null);
        setError(null);
    }, []);

    return { mutate, isLoading, error, data, reset };
}
