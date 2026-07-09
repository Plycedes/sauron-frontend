export type UpdateCategory = 'feature' | 'bug' | 'review' | 'meeting' | 'research' | 'deployment';

export type UpdateConfidence = 'low' | 'medium' | 'high';

export interface UpdateResponse {
  _id: string;
  projectId: string;
  authorId: string;
  category: UpdateCategory;
  confidence: UpdateConfidence;
  body: string;
  hoursSpent: number;
  nextSteps: string;
  blockers: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateInput {
  projectId: string;
  category: UpdateCategory;
  confidence: UpdateConfidence;
  body: string;
  hoursSpent: number;
  nextSteps: string;
  blockers: string;
}
