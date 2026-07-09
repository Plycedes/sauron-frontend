export type ProjectStatus = 'active' | 'paused' | 'archived' | 'completed';

export interface ProjectMember {
  userId: string;
  role: 'pm' | 'member';
  addedAt: string;
}

export interface ProjectResponse {
  _id: string;
  name: string;
  description?: string;
  companyId: string;
  status: ProjectStatus;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectInput {
  companyId: string;
  name: string;
  description?: string;
}
