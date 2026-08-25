import { request } from './request';
import { Job, JobListParams, PaginatedResult } from '@types/job.types';

// 获取职位列表
export const getJobList = (params: JobListParams) => {
  return request.get<PaginatedResult<Job>>('/jobs', { params });
};

// 获取职位详情
export const getJobDetail = (id: number) => {
  return request.get<Job>(`/jobs/${id}`);
};

// 创建职位（企业端）
export const createJob = (data: Partial<Job>) => {
  return request.post<Job>('/jobs', data);
};

// 更新职位（企业端）
export const updateJob = (id: number, data: Partial<Job>) => {
  return request.put<Job>(`/jobs/${id}`, data);
};

// 发布职位
export const publishJob = (id: number) => {
  return request.post<Job>(`/jobs/${id}/publish`);
};

// 关闭职位
export const closeJob = (id: number) => {
  return request.post<Job>(`/jobs/${id}/close`);
};

// 删除职位
export const deleteJob = (id: number) => {
  return request.delete(`/jobs/${id}`);
};

// 获取匹配的候选人（企业端）
export const getMatchedCandidates = (jobId: number, params?: any) => {
  return request.get(`/matching/jobs/${jobId}/candidates`, { params });
};
