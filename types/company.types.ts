export interface CompanyResponse {
  _id: string;
  name: string;
  domain: string;
  adminId: string;
  createdAt: string;
  role: MembershipRole;
}

export interface CompanyInput {
  name: string;
  domain: string;
}

export type MembershipRole = 'company_admin' | 'pm' | 'member';

export interface MembershipResponse {
  _id: string;
  userId: string;
  companyId: string;
  role: MembershipRole;
  joinedAt: string;
  name?: string;
}
