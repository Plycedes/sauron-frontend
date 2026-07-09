import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { CompanyInput, CompanyResponse, MembershipResponse } from '@/types/company.types';

export async function createCompany(input: CompanyInput): Promise<CompanyResponse> {
  const response = await apiClient.post<ApiResponse<CompanyResponse>>(
    ENDPOINTS.companies.create,
    input,
  );
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
  return payload.data;
}

export async function getCompany(id: string): Promise<CompanyResponse> {
  const response = await apiClient.get<ApiResponse<CompanyResponse>>(ENDPOINTS.companies.byId(id));
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
  return payload.data;
}

export async function getCompanyMembers(companyId: string): Promise<MembershipResponse[]> {
  const response = await apiClient.get<ApiResponse<MembershipResponse[]>>(
    ENDPOINTS.companies.members(companyId),
  );
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
  return payload.data;
}
