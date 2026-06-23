import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type {
    ConfidenceTrendPoint,
    ProjectStatsResponse,
    StaleMemberResponse,
    UserStatsResponse,
} from '@/types/analytics.types';
import { definedParams } from './_params';

export async function getProjectStats(projectId: string): Promise<ProjectStatsResponse> {
    const response = await apiClient.get<ApiResponse<ProjectStatsResponse>>(
        ENDPOINTS.analytics.projectStats(projectId),
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getUserStats(
    userId: string,
    projectId?: string,
): Promise<UserStatsResponse> {
    const response = await apiClient.get<ApiResponse<UserStatsResponse>>(
        ENDPOINTS.analytics.userStats(userId),
        { params: definedParams({ projectId }) },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getConfidenceTrend(
    projectId: string,
    days?: number,
): Promise<ConfidenceTrendPoint[]> {
    const response = await apiClient.get<ApiResponse<ConfidenceTrendPoint[]>>(
        ENDPOINTS.analytics.confidenceTrend(projectId),
        { params: definedParams({ days }) },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getStaleMembers(
    projectId: string,
    thresholdDays?: number,
): Promise<StaleMemberResponse[]> {
    const response = await apiClient.get<ApiResponse<StaleMemberResponse[]>>(
        ENDPOINTS.analytics.staleMembers(projectId),
        { params: definedParams({ thresholdDays }) },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}