import { Injectable, Logger } from '@nestjs/common';
import { AiConfig } from './ai.config';
import { LlmHttpClient } from './ai.llm.client';
import { AI_PROMPTS, safeParseJson } from './ai.prompts';

/**
 * AI 服务
 *
 * 调用流程：
 *   业务层 (resumes / jobs / matching)
 *        → AiService
 *          → AiConfig (读取 .env，判断是否可用)
 *          → LlmHttpClient (axios 封装 + 超时 + 重试，失败返回 null)
 *          → AI_PROMPTS (统一模板 + JSON 解析兜底)
 *
 * 降级策略：
 *   - LLM 未配置或调用失败：返回「安全空结构」，让调用方规则/关键词逻辑继续工作。
 *   - 前端/日志会感知到 AI 未启用（confidence=0 / suggestions 为空等），便于后续 LLM 接口到位后验证。
 */
@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private readonly config: AiConfig,
    private readonly llm: LlmHttpClient,
  ) {
    if (this.config.llmAvailable) {
      this.logger.log(
        `AI 服务已启用 provider=${this.config.provider} model=${this.config.model} baseURL=${this.config.baseURL}`,
      );
    } else {
      this.logger.warn(
        'AI 服务处于 Mock 降级模式。待提供 LLM 接口后，在 .env 中填入 LLM_PROVIDER / LLM_BASE_URL / LLM_API_KEY / LLM_MODEL 即可启用。',
      );
    }
  }

  /**
   * 对外暴露：当前 LLM 是否真实可用（用于调用方是否走 AI 分支的判断）
   */
  get llmAvailable(): boolean {
    return this.config.llmAvailable;
  }

  // ---------------------------------------------------------------------------
  // 1. 简历结构化解析
  // ---------------------------------------------------------------------------
  async parseResume(
    fileContent: string,
    fileType: string = 'text',
  ): Promise<{
    name: string;
    phone: string;
    email: string;
    education: any[];
    workExperience: any[];
    projects: any[];
    skills: string[];
    summary: string;
    confidence: number;
  }> {
    const fallback = {
      name: '',
      phone: '',
      email: '',
      education: [],
      workExperience: [],
      projects: [],
      skills: [],
      summary: '',
      confidence: 0,
    };

    const text = await this.llm.createChatCompletion(
      [
        { role: 'system', content: AI_PROMPTS.parseResume.system },
        {
          role: 'user',
          content: AI_PROMPTS.parseResume.buildUser(fileContent || '', fileType),
        },
      ],
      { temperature: 0.1, responseFormat: { type: 'json_object' }, maxTokens: 4000 },
    );
    if (!text) return fallback;
    const parsed = safeParseJson<any>(text, null);
    if (!parsed) return fallback;

    return {
      name: String(parsed.name || '').trim(),
      phone: String(parsed.phone || '').trim(),
      email: String(parsed.email || '').trim().toLowerCase(),
      education: Array.isArray(parsed.education) ? parsed.education : [],
      workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills.map((s: any) => String(s).trim()).filter(Boolean) : [],
      summary: String(parsed.summary || '').trim(),
      confidence: Number.isFinite(Number(parsed.confidence)) ? Math.min(1, Math.max(0, Number(parsed.confidence))) : 0,
    };
  }

  // ---------------------------------------------------------------------------
  // 2. JD 抽取
  // ---------------------------------------------------------------------------
  async extractJD(jdText: string): Promise<{
    title: string;
    requiredSkills: string[];
    preferredSkills: string[];
    experienceMin: number | null;
    experienceMax: number | null;
    educationRequirement: string | null;
    responsibilities: string[];
    requirements: string[];
  }> {
    const fallback = {
      title: '',
      requiredSkills: [],
      preferredSkills: [],
      experienceMin: null,
      experienceMax: null,
      educationRequirement: null,
      responsibilities: [],
      requirements: [],
    };
    const text = await this.llm.createChatCompletion(
      [
        { role: 'system', content: AI_PROMPTS.extractJD.system },
        { role: 'user', content: AI_PROMPTS.extractJD.buildUser(jdText || '') },
      ],
      { temperature: 0.1, responseFormat: { type: 'json_object' }, maxTokens: 2500 },
    );
    if (!text) return fallback;
    const parsed = safeParseJson<any>(text, null);
    if (!parsed) return fallback;

    const asNumOrNull = (v: any) => (Number.isFinite(Number(v)) && Number(v) >= 0 ? Number(v) : null);
    return {
      title: String(parsed.title || '').trim(),
      requiredSkills: Array.isArray(parsed.requiredSkills)
        ? parsed.requiredSkills.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
      preferredSkills: Array.isArray(parsed.preferredSkills)
        ? parsed.preferredSkills.map((s: any) => String(s).trim()).filter(Boolean)
        : [],
      experienceMin: asNumOrNull(parsed.experienceMin),
      experienceMax: asNumOrNull(parsed.experienceMax),
      educationRequirement: parsed.educationRequirement ? String(parsed.educationRequirement) : null,
      responsibilities: Array.isArray(parsed.responsibilities)
        ? parsed.responsibilities.map((s: any) => String(s)).filter(Boolean)
        : [],
      requirements: Array.isArray(parsed.requirements)
        ? parsed.requirements.map((s: any) => String(s)).filter(Boolean)
        : [],
    };
  }

  // ---------------------------------------------------------------------------
  // 3. 简历优化建议
  // ---------------------------------------------------------------------------
  async generateResumeSuggestions(
    resumeData: Record<string, any>,
    jobDescription: string,
  ): Promise<{
    overallScore: number;
    suggestions: Array<{
      category: string;
      priority: 'high' | 'medium' | 'low';
      content: string;
      originalText?: string;
      suggestedText?: string;
    }>;
  }> {
    const fallback = { overallScore: 0, suggestions: [] };
    const text = await this.llm.createChatCompletion(
      [
        { role: 'system', content: AI_PROMPTS.resumeSuggestions.system },
        {
          role: 'user',
          content: AI_PROMPTS.resumeSuggestions.buildUser(
            JSON.stringify(resumeData || {}),
            jobDescription || '',
          ),
        },
      ],
      { temperature: 0.4, responseFormat: { type: 'json_object' }, maxTokens: 4000 },
    );
    if (!text) return fallback;
    const parsed = safeParseJson<any>(text, null);
    if (!parsed) return fallback;
    const score = Number.isFinite(Number(parsed.overallScore))
      ? Math.min(100, Math.max(0, Number(parsed.overallScore)))
      : 0;
    const list = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
    return {
      overallScore: score,
      suggestions: list.map((s: any) => ({
        category: String(s.category || '其他'),
        priority: (['high', 'medium', 'low'].includes(s.priority) ? s.priority : 'medium') as any,
        content: String(s.content || '').trim(),
        originalText: s.originalText ? String(s.originalText) : undefined,
        suggestedText: s.suggestedText ? String(s.suggestedText) : undefined,
      })).filter((x: any) => x.content),
    };
  }

  // ---------------------------------------------------------------------------
  // 4. 匹配理由
  // ---------------------------------------------------------------------------
  async generateMatchReason(
    resumeData: Record<string, any>,
    jobData: Record<string, any>,
    matchScore: number,
  ): Promise<{
    summary: string;
    strengths: string[];
    gaps: string[];
    overallReason: string;
  }> {
    const fallback = { summary: '', strengths: [], gaps: [], overallReason: '' };
    const text = await this.llm.createChatCompletion(
      [
        { role: 'system', content: AI_PROMPTS.matchReason.system },
        {
          role: 'user',
          content: AI_PROMPTS.matchReason.buildUser(
            JSON.stringify(resumeData || {}),
            JSON.stringify(jobData || {}),
            matchScore,
          ),
        },
      ],
      { temperature: 0.3, responseFormat: { type: 'json_object' }, maxTokens: 1500 },
    );
    if (!text) return fallback;
    const parsed = safeParseJson<any>(text, null);
    if (!parsed) return fallback;
    return {
      summary: String(parsed.summary || '').trim(),
      strengths: Array.isArray(parsed.strengths)
        ? parsed.strengths.map((s: any) => String(s)).filter(Boolean)
        : [],
      gaps: Array.isArray(parsed.gaps)
        ? parsed.gaps.map((s: any) => String(s)).filter(Boolean)
        : [],
      overallReason: String(parsed.overallReason || '').trim(),
    };
  }

  // ---------------------------------------------------------------------------
  // 5. 向量化 + 相似度（未配置 embedding 时返回空数组，走关键词分支）
  // ---------------------------------------------------------------------------
  async vectorize(text: string): Promise<number[]> {
    if (!text) return [];
    const vec = await this.llm.createEmbedding(text);
    return Array.isArray(vec) ? vec : [];
  }

  async vectorizeBatch(texts: string[]): Promise<number[][]> {
    if (!texts?.length) return [];
    const res = await this.llm.createEmbeddingBatch(texts);
    return res.map((v) => (Array.isArray(v) ? v : []));
  }

  cosineSimilarity(vecA: number[], vecB: number[]): number {
    if (vecA.length !== vecB.length || vecA.length === 0) return 0;
    let dot = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
      const a = Number(vecA[i]) || 0;
      const b = Number(vecB[i]) || 0;
      dot += a * b;
      normA += a * a;
      normB += b * b;
    }
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
