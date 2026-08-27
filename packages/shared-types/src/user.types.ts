// =============================================================
// 用户 / 角色 / 认证
// =============================================================
export type UserRole = 'candidate' | 'employer' | 'admin';
export const UserRoleEnum: Record<UserRole, UserRole> = {
  CANDIDATE: 'candidate',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
} as const;

export type UserStatus = 'active' | 'inactive' | 'banned';
export const UserStatusEnum: Record<UserStatus, UserStatus> = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  BANNED: 'banned',
} as const;

export interface UserInfo {
  id: number;
  email: string;
  nickname: string | null;
  avatar: string | null;
  role: UserRole;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
  candidateId?: number | null;
  companyId?: number | null;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  nickname?: string;
  role?: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  tokenType?: 'Bearer';
  expiresIn?: number;
  user: UserInfo;
}
