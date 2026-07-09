export type ProjectStatus = 'active' | 'on_hold' | 'completed' | 'archived';

export interface ProjectResponse {
  _id: string;
  name: string;
  description: string;
  companyId: string;
  createdBy: string;
  memberIds: string[];
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectInput {
  companyId: string;
  name: string;
  description?: string;
}
