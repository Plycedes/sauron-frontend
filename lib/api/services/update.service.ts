import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { UpdateInput, UpdateResponse } from '@/types/update.types';
import { definedParams } from './_params';

export async function submitUpdate(input: UpdateInput): Promise<UpdateResponse> {
    const response = await apiClient.post<ApiResponse<UpdateResponse>>(
        ENDPOINTS.updates.submit,
        input,
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getUpdatesByProject(
    projectId: string,
    from?: string,
    to?: string,
): Promise<UpdateResponse[]> {
    const response = await apiClient.get<ApiResponse<UpdateResponse[]>>(
        ENDPOINTS.updates.byProject,
        { params: definedParams({ projectId, from, to }) },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getUpdatesByUser(
    userId: string,
    projectId?: string,
    from?: string,
    to?: string,
): Promise<UpdateResponse[]> {
    const response = await apiClient.get<ApiResponse<UpdateResponse[]>>(
        ENDPOINTS.updates.byUser,
        { params: definedParams({ userId, projectId, from, to }) },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}
