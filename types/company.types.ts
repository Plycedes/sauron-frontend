export interface CompanyResponse {
  id: string;
  name: string;
  slug?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role: string;
}

export interface CompanyInput {
  name: string;
  slug?: string;
  domain?: string;
}
