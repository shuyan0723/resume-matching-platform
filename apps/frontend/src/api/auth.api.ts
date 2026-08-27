import { request } from './request';
import { LoginParams, RegisterParams, UserInfo, AuthResponse } from '@app-types/user.types';

// 登录
export const login = (params: LoginParams) => {
  return request.post<AuthResponse>('/auth/login', params);
};

// 注册
export const register = (params: RegisterParams) => {
  return request.post<AuthResponse>('/auth/register', params);
};

// 获取用户信息
export const getUserProfile = () => {
  return request.get<UserInfo>('/users/profile');
};
