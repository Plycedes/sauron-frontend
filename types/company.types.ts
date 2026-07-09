export interface CompanyResponse {
  id: string;
  name: string;
  slug?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role: MembershipRole;
}

export interface CompanyInput {
  name: string;
  slug?: string;
  domain?: string;
}

export type MembershipRole = 'company_admin' | 'pm' | 'member';

export interface MembershipResponse {
  id: string;
  userId: string;
  companyId: string;
  role: MembershipRole;
  joinedAt: string;
}
