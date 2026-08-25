// 用户相关类型定义

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

export interface UserInfo {
  id: number;
  email: string;
  nickname: string | null;
  avatar: string | null;
  role: UserRole;
  phone: string | null;
  status: UserStatus;
  createdAt: string;
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
  user: UserInfo;
}
