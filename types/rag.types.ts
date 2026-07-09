export interface RagSource {
  updateId: string;
  userId: string;
  projectId: string;
  date: string;
  category: string;
  text: string;
}

export interface RagQueryResult {
  answer: string;
  sources: RagSource[];
}

export interface RagQueryInput {
  question: string;
  companyId: string;
  projectId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}
