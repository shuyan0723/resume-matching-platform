// 职位相关类型定义

export enum EducationRequirement {
  HIGH_SCHOOL = 'high_school',
  COLLEGE = 'college',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  REMOTE = 'remote',
}

export enum JobStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAUSED = 'paused',
  CLOSED = 'closed',
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
  requirements: any | null;
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
  company?: {
    id: number;
    name: string;
    logo: string | null;
    industry: string | null;
    size: string | null;
  };
}

export interface JobListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceMin?: number;
  education?: EducationRequirement;
  jobType?: JobType;
}
