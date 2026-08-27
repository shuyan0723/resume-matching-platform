// =============================================================
// 匹配相关类型
// =============================================================
export interface MatchDetail {
  overallScore: number;
  skillMatch: number;
  experienceMatch: number;
  educationMatch: number;
  locationMatch: number;
  salaryMatch: number;
  vectorMatch: number;
  /** 各维度的细分解释：命中技能/缺失技能/年限差异等 */
  details: {
    matchedSkills?: string[];
    missingSkills?: string[];
    experienceGapYears?: number;
    salaryGap?: number;
    [k: string]: any;
  };
  /** AI 生成的自然语言理由（未启用时为 undefined） */
  aiReason?: MatchReason | null;
}

export interface MatchReason {
  summary: string;
  strengths: string[];
  gaps: string[];
  overallReason: string;
}

export interface MatchResult {
  jobId: number;
  resumeId?: number;
  job?: any;
  resume?: any;
  matchScore: number;
  matchDetail: MatchDetail;
  matchReason?: string;
}

// AI 匹配理由结构（同 MatchReason，作为 AI 输出 Schema）
export type MatchReasonAI = MatchReason;

// AI 简历优化建议结构
export interface ResumeSuggestionsAI {
  overallScore: number;
  suggestions: Array<{
    category: '技能' | '经历' | '项目' | '学历' | '简历撰写' | '其他';
    priority: 'high' | 'medium' | 'low';
    content: string;
    originalText: string | null;
    suggestedText: string | null;
  }>;
}
