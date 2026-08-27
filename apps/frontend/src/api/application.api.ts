import { request } from './request';

// 申请状态枚举（与后端 ApplicationStatus 对齐）
export enum AppStatus {
  APPLIED = 'applied',
  VIEWED = 'viewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

export interface ApplicationItem {
  id: number;
  jobId: number;
  resumeId: number;
  candidateId: number;
  companyId: number;
  matchScore: number | null;
  matchDetail: Record<string, any> | null;
  status: AppStatus;
  candidateNote: string | null;
  employerNote: string | null;
  appliedAt: string;
  viewedAt: string | null;
  job?: {
    id: number;
    title: string;
    department: string | null;
    location: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    description: string | null;
    requiredSkills: string[] | null;
    status: string;
    company?: {
      id: number;
      name: string;
      logo: string | null;
      industry: string | null;
      size: string | null;
    };
  };
  resume?: {
    id: number;
    title: string;
    skills: string[] | null;
  };
}

// 获取当前用户的投递记录
export const getMyApplications = (): Promise<ApplicationItem[]> => {
  return request.get<ApplicationItem[]>('/applications/by-candidate');
};

// 申请职位
export const applyJob = (data: {
  jobId: number;
  resumeId: number;
  companyId: number;
}): Promise<ApplicationItem> => {
  return request.post<ApplicationItem>('/applications/apply', data);
};

// 更新申请状态
export const updateApplicationStatus = (
  id: number,
  status: AppStatus,
): Promise<ApplicationItem> => {
  return request.put<ApplicationItem>(`/applications/${id}/status`, { status });
};
