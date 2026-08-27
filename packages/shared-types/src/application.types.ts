// =============================================================
// 投递记录相关类型
// =============================================================
import type { Job, CompanyPreview, Resume } from './job.types';
import type { MatchDetail } from './matching.types';

export type ApplicationStatus =
  | 'applied'
  | 'viewed'
  | 'shortlisted'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'hired';
export const ApplicationStatusEnum: Record<ApplicationStatus, ApplicationStatus> = {
  APPLIED: 'applied',
  VIEWED: 'viewed',
  SHORTLISTED: 'shortlisted',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  HIRED: 'hired',
} as const;

export interface Application {
  id: number;
  jobId: number;
  resumeId: number;
  candidateId: number;
  companyId: number;
  matchScore: number | null;
  matchDetail: MatchDetail | null;
  status: ApplicationStatus;
  candidateNote: string | null;
  employerNote: string | null;
  appliedAt: string;
  viewedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
  // 关联字段（服务端 eager 返回）
  job?: Pick<Job, 'id' | 'title' | 'location' | 'salaryMin' | 'salaryMax'> & {
    company?: CompanyPreview;
  };
  resume?: Pick<Resume, 'id' | 'title' | 'parseStatus' | 'skills'>;
  candidate?: { id: number; name?: string | null; avatar?: string | null };
}

export interface ApplicationListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: ApplicationStatus;
  jobId?: number;
}
