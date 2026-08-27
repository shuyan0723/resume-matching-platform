// =============================================================
// 职位相关类型
// =============================================================
export type EducationRequirement = 'high_school' | 'college' | 'bachelor' | 'master' | 'phd';
export const EducationRequirementEnum: Record<EducationRequirement, EducationRequirement> = {
  HIGH_SCHOOL: 'high_school',
  COLLEGE: 'college',
  BACHELOR: 'bachelor',
  MASTER: 'master',
  PHD: 'phd',
} as const;

export type JobType = 'full_time' | 'part_time' | 'internship' | 'remote';
export const JobTypeEnum: Record<JobType, JobType> = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  INTERNSHIP: 'internship',
  REMOTE: 'remote',
} as const;

export type JobStatus = 'draft' | 'open' | 'paused' | 'closed';
export const JobStatusEnum: Record<JobStatus, JobStatus> = {
  DRAFT: 'draft',
  OPEN: 'open',
  PAUSED: 'paused',
  CLOSED: 'closed',
} as const;

export interface CompanyPreview {
  id: number;
  name: string;
  logo: string | null;
  industry: string | null;
  size: string | null;
  location?: string | null;
}

export interface Job {
  id: number;
  companyId: number;
  title: string;
  department: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  experienceMin: number | null;
  experienceMax: number | null;
  educationRequirement: EducationRequirement | null;
  jobType: JobType;
  description: string | null;
  requirements: Record<string, any> | string[] | null;
  requiredSkills: string[] | null;
  preferredSkills: string[] | null;
  status: JobStatus;
  viewCount: number;
  applicationCount: number;
  urgent: number;
  publishedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  company?: CompanyPreview;
  jobVector?: string | null;
}

export interface JobListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: JobStatus | 'any';
  companyId?: number;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  education?: EducationRequirement;
  jobType?: JobType;
}

// AI JD 抽取结构（模型返回 JSON Schema）
export interface ParsedJobAI {
  title: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceMin: number | null;
  experienceMax: number | null;
  educationRequirement: string | null;
  location: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  responsibilities: string[];
  requirements: string[];
}
