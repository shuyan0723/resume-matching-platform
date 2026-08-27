import { request } from './request';
import type { Resume } from '@app-types/resume.types';

// 获取当前用户的简历列表（后端返回数组，非分页）
export const getResumeList = (): Promise<Resume[]> => {
  return request.get<Resume[]>('/resumes');
};

// 获取简历详情（含工作经历/教育经历/项目经历）
export const getResumeDetail = (id: number): Promise<Resume> => {
  return request.get<Resume>(`/resumes/${id}`);
};

// 上传简历文件（会触发异步 AI 解析队列）
export const uploadResume = (file: File): Promise<Resume> => {
  const formData = new FormData();
  formData.append('file', file);
  return request.upload<Resume>('/resumes/upload', formData);
};

// 手动触发简历解析
export const parseResume = (id: number) => {
  return request.post<{ jobId: string; status: string }>(`/resumes/${id}/parse`);
};

// 更新简历
export const updateResume = (id: number, data: Partial<Resume>): Promise<Resume> => {
  return request.put<Resume>(`/resumes/${id}`, data);
};

// 删除简历（同时删除关联经历和物理文件）
export const deleteResume = (id: number) => {
  return request.delete<{ success: boolean }>(`/resumes/${id}`);
};

// 设置默认简历（PUT 方法）
export const setDefaultResume = (id: number) => {
  return request.put<{ success: boolean }>(`/resumes/${id}/default`);
};

// 获取解析结果
export const getResumeParseResult = (id: number) => {
  return request.get<{ status: string; data: any; confidence: number | null }>(
    `/resumes/${id}/parse-result`,
  );
};

// 为当前用户（求职者）推荐匹配岗位
export const getMatchedJobs = (params?: { resumeId?: number; limit?: number }) => {
  return request.get<{ jobs: any[]; total: number }>('/matching/jobs', { params });
};

// 获取简历与某职位的匹配详情
export const getMatchDetail = (params: { resumeId: number; jobId: number }) => {
  return request.get('/matching/detail', { params });
};
