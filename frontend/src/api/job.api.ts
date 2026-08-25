import { request } from './request';
import type { Job, PaginatedResult } from '@types/job.types';

export interface JobListQuery {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: string;
  companyId?: number;
}

// 获取职位列表（公开分页，默认仅招聘中）
export const getJobList = (
  params: JobListQuery = {},
): Promise<PaginatedResult<Job>> => {
  return request.get<PaginatedResult<Job>>('/jobs', { params });
};

// 企业端 - 获取自己公司的职位列表（含草稿/暂停/关闭），自动按 JWT 的 companyId 过滤
export const getMyCompanyJobList = (
  params: JobListQuery = {},
): Promise<PaginatedResult<Job>> => {
  return request.get<PaginatedResult<Job>>('/jobs/me', { params });
};

// 获取职位详情
export const getJobDetail = (id: number): Promise<Job> => {
  return request.get<Job>(`/jobs/${id}`);
};

// 创建职位（企业端）
export const createJob = (data: Partial<Job>): Promise<Job> => {
  return request.post<Job>('/jobs', data);
};

// 更新职位（企业端）
export const updateJob = (id: number, data: Partial<Job>): Promise<Job> => {
  return request.put<Job>(`/jobs/${id}`, data);
};

// 发布职位 / 开启招聘
export const publishJob = (id: number): Promise<Job> => {
  return request.put<Job>(`/jobs/${id}/publish`);
};

// 暂停招聘
export const pauseJob = (id: number): Promise<Job> => {
  return request.put<Job>(`/jobs/${id}/pause`);
};

// 关闭职位（结束招聘）
export const closeJob = (id: number): Promise<Job> => {
  return request.put<Job>(`/jobs/${id}/close`);
};

// 删除职位
export const deleteJob = (id: number) => {
  return request.delete<{ success: boolean }>(`/jobs/${id}`);
};

// 获取匹配的候选人（企业端）
export const getMatchedCandidates = (params: { jobId: number; limit?: number }) => {
  return request.get<{ candidates: any[]; total: number }>('/matching/candidates', {
    params,
  });
};
