import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { ProjectInput, ProjectResponse } from '@/types/project.types';

export async function createProject(input: ProjectInput): Promise<ProjectResponse> {
    const response = await apiClient.post<ApiResponse<ProjectResponse>>(
        ENDPOINTS.projects.create,
        input,
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function getProjects(companyId: string): Promise<ProjectResponse[]> {
    const response = await apiClient.get<ApiResponse<ProjectResponse[]>>(
        ENDPOINTS.projects.list,
        { params: { companyId } },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}

export async function addProjectMember(projectId: string, userId: string): Promise<void> {
    const response = await apiClient.post<ApiResponse<unknown>>(
        ENDPOINTS.projects.addMember(projectId),
        { userId },
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
}

export async function removeProjectMember(projectId: string, userId: string): Promise<void> {
    const response = await apiClient.delete<ApiResponse<unknown>>(
        ENDPOINTS.projects.removeMember(projectId, userId),
    );
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
}