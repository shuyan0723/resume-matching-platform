// =============================================================
// 简历相关类型
// =============================================================
export type ParseStatus = 'pending' | 'processing' | 'completed' | 'failed';
export const ParseStatusEnum: Record<ParseStatus, ParseStatus> = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export interface WorkExperience {
  id?: number;
  resumeId?: number;
  companyName: string;
  position: string;
  startDate: string | null;
  endDate: string | null;
  isCurrent: number; // tinyint 0/1
  description: string | null;
  skills?: string[] | null;
  sortOrder?: number;
}

export interface Education {
  id?: number;
  resumeId?: number;
  schoolName: string;
  degree: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  gpa?: number | null;
  sortOrder?: number;
}

export interface Project {
  id?: number;
  resumeId?: number;
  name: string;
  role: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
  techStack?: string[] | null;
  sortOrder?: number;
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
  resumeVector?: string | null;
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

export interface ResumeUploadResponse {
  id: number;
  title: string;
  parseStatus: ParseStatus;
  message?: string;
}

// AI 简历解析结构（模型返回 JSON Schema）
export interface ParsedResumeAI {
  name: string;
  phone: string;
  email: string;
  location: string;
  yearsOfExperience: number;
  education: Array<{
    school: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    highlights?: string[];
  }>;
  projects: Array<{
    name: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description: string;
    technologies?: string[];
  }>;
  skills: string[];
  summary: string;
  confidence: number;
}
