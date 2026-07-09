import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import type { ApiResponse } from '../types';
import type { InviteInput, InviteResponse } from '@/types/invite.types';

export async function sendInvite(input: InviteInput): Promise<InviteResponse> {
  const response = await apiClient.post<ApiResponse<InviteResponse>>(ENDPOINTS.invites.send, input);
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
  return payload.data;
}

export async function getPendingInvites(): Promise<InviteResponse[]> {
  const response = await apiClient.get<ApiResponse<InviteResponse[]>>(ENDPOINTS.invites.pending);
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
  return payload.data;
}

export async function acceptInvite(token: string): Promise<void> {
  const response = await apiClient.post<ApiResponse<unknown>>(ENDPOINTS.invites.accept, { token });
  const payload = response.data;
  if (!payload.success) {
    throw new Error(payload.message);
  }
}
