import { request } from './request';
import { Resume, ResumeListParams, PaginatedResult } from '@types/resume.types';

// 获取简历列表
export const getResumeList = (params: ResumeListParams) => {
  return request.get<PaginatedResult<Resume>>('/resumes', { params });
};

// 获取简历详情
export const getResumeDetail = (id: number) => {
  return request.get<Resume>(`/resumes/${id}`);
};

// 上传简历文件
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return request.upload<Resume>('/resumes/upload', formData);
};

// 解析简历
export const parseResume = (id: number) => {
  return request.post<Resume>(`/resumes/${id}/parse`);
};

// 更新简历
export const updateResume = (id: number, data: Partial<Resume>) => {
  return request.put<Resume>(`/resumes/${id}`, data);
};

// 删除简历
export const deleteResume = (id: number) => {
  return request.delete(`/resumes/${id}`);
};

// 设置默认简历
export const setDefaultResume = (id: number) => {
  return request.post<Resume>(`/resumes/${id}/default`);
};

// 获取匹配的岗位
export const getMatchedJobs = (resumeId: number, params?: any) => {
  return request.get(`/matching/resumes/${resumeId}/jobs`, { params });
};
