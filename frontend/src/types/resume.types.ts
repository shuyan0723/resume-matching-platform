// 简历相关类型定义

export enum ParseStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface WorkExperience {
  id: number;
  resumeId: number;
  companyName: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: number;
  description: string | null;
  skills: string[] | null;
  sortOrder: number;
}

export interface Education {
  id: number;
  resumeId: number;
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa: number | null;
  sortOrder: number;
}

export interface Project {
  id: number;
  resumeId: number;
  name: string;
  role: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  techStack: string[] | null;
  sortOrder: number;
}

export interface Resume {
  id: number;
  candidateId: number;
  title: string;
  fileName: string | null;
  filePath: string | null;
  fileSize: number | null;
  fileType: string | null;
  parseStatus: ParseStatus;
  parseConfidence: number | null;
  isDefault: number;
  parsedData: Record<string, any> | null;
  skills: string[] | null;
  createdAt: string;
  updatedAt: string;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  projects?: Project[];
}

export interface ResumeListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
}

export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 匹配结果
export interface MatchResult {
  jobId: number;
  job: any;
  matchScore: number;
  matchDetail: {
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    locationMatch: number;
    salaryMatch: number;
  };
  matchReason: string;
}
