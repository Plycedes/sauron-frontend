import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { CompanyResponse } from '@/types/company.types';

export async function getMyCompanies(): Promise<CompanyResponse[]> {
    const response = await apiClient.get<ApiResponse<CompanyResponse[]>>(ENDPOINTS.users.myCompanies);
    const payload = response.data;
    if (!payload.success) {
        throw new Error(payload.message);
    }
    return payload.data;
}
