export type UserRole = 'super_admin' | 'company_admin' | 'pm' | 'member';

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterInput {
  userId: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  userId: string;
  password: string;
}
