export type InviteStatus = 'pending' | 'accepted' | 'expired';
export type InviteRole = 'pm' | 'member';

export interface InviteResponse {
  _id: string;
  email: string;
  companyId: string;
  role: InviteRole;
  status: InviteStatus;
  token: string;
  expiresAt: string;
}

export interface InviteInput {
  email: string;
  companyId: string;
  role: InviteRole;
}
