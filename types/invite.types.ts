export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface InviteResponse {
  _id: string;
  email: string;
  companyId: string;
  projectId?: string | null;
  role: 'pm' | 'member';
  status: InviteStatus;
  token: string;
  invitedBy: string;
  expiresAt: string;
  createdAt: string;
  acceptedAt?: string | null;
}

export interface InviteInput {
  email: string;
  companyId: string;
  projectId?: string;
  role: 'pm' | 'member';
}
