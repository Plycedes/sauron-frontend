import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { RagQueryInput, RagQueryResult } from '@/types/rag.types';

export async function queryRag(input: RagQueryInput): Promise<RagQueryResult> {
    const response = await apiClient.post<ApiResponse<RagQueryResult>>(
        ENDPOINTS.rag.query,
        input,
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}