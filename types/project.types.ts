import type { MembershipRole } from './company.types';

export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export interface ProjectMember {
  _id: string;
  fullName: string;
  role: MembershipRole;
}

export interface ProjectResponse {
  _id: string;
  name: string;
  description: string;
  companyId: string;
  createdBy: string;
  members: ProjectMember[];
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectInput {
  companyId: string;
  name: string;
  description?: string;
}
