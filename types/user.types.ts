export type UserRole = 'super_admin' | 'user';
export type UserStatus = 'active' | 'pending' | 'suspended';

export interface UserResponse {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  avatar?: string;
  status: UserStatus;
  createdAt: string;
  lastLoginAt: string;
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
