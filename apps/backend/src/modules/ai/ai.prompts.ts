/**
 * AI Prompt 模板集中管理（便于 LLM 到位后统一调优）
 *
 * 所有模板尽量要求模型输出 JSON，调用方可直接 JSON.parse，不匹配时 fallback 到空结构。
 */

export const AI_PROMPTS = {
  parseResume: {
    system: `你是一个专业的简历结构化抽取助手。你会拿到一段从 PDF/Word 提取出的简历原始文本，
输出一个严格合法的 JSON，不要任何额外解释或 Markdown 代码块。

字段要求：
- name: string             姓名
- phone: string            手机号
- email: string            邮箱
- location: string         所在城市（留空字符串）
- yearsOfExperience: number   总工作年限（0 表示应届生/实习生）
- education: array<{
    school: string;
    degree: string;         // 学士 / 硕士 / 博士 / 专科 / 其他
    major: string;
    startDate: string;      // "YYYY-MM" 格式，不知道就空字符串
    endDate: string;
    description?: string;
  }>
- workExperience: array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;        // 仍在职填至今，建议空字符串
    description: string;    // 工作内容描述（合并要点）
    highlights?: string[];  // 亮点/成果
  }>
- projects: array<{
    name: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    description: string;
    technologies?: string[];
  }>
- skills: string[]          技能列表（去重、小写统一）
- summary: string           候选人一句话简介（50 字内）
- confidence: number        你对本次抽取质量的信心 0-1

未提到的字段填空字符串/空数组，不要编造。`,
    buildUser: (rawText: string, fileType?: string) =>
      `【文件类型】${fileType || 'text'}\n\n【简历原始文本】\n${rawText.slice(0, 24000)}`,
  },

  extractJD: {
    system: `你是 JD 结构化抽取助手。输入职位描述文本，输出 JSON：

{
  "title": string,
  "requiredSkills": string[],
  "preferredSkills": string[],
  "experienceMin": number | null,   // 最小年限，null 表示不限
  "experienceMax": number | null,
  "educationRequirement": string | null,   // 如 "本科" / "硕士"
  "location": string | null,
  "salaryMin": number | null,       // 单位 k
  "salaryMax": number | null,
  "responsibilities": string[],
  "requirements": string[]
}`,
    buildUser: (jdText: string) => jdText.slice(0, 16000),
  },

  resumeSuggestions: {
    system: `你是资深招聘顾问。根据目标职位要求，对简历给出优化建议，输出 JSON：

{
  "overallScore": number,               // 0-100
  "suggestions": [
    {
      "category": "技能" | "经历" | "项目" | "学历" | "简历撰写" | "其他",
      "priority": "high" | "medium" | "low",
      "content": string,
      "originalText": string | null,
      "suggestedText": string | null
    }
  ]
}`,
    buildUser: (resumeData: string, jdText: string) =>
      `【简历 JSON】\n${resumeData}\n\n【目标 JD】\n${jdText.slice(0, 8000)}`,
  },

  matchReason: {
    system: `你是简历-JD 匹配评估师。基于已给的匹配分数，输出匹配理由 JSON：

{
  "summary": string,              // 20-50 字一句话总评
  "strengths": string[],          // 3-6 条优势，每条 15-30 字
  "gaps": string[],               // 0-4 条缺口，每条 15-30 字
  "overallReason": string         // 80-150 字综合说明，面向 HR 可读
}`,
    buildUser: (resumeData: string, jobData: string, matchScore: number) =>
      `【匹配分数（0-100）】${matchScore}\n\n【简历 JSON】\n${resumeData}\n\n【职位 JSON】\n${jobData}`,
  },
};

/**
 * 安全 JSON.parse：失败时返回 fallback，避免阻塞上游。
 */
export function safeParseJson<T = any>(text: string | null | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    // 部分模型会包一层 ```json ... ```，去掉再解析
    let cleaned = text.trim();
    const fence = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (fence) cleaned = fence[1];
    return JSON.parse(cleaned) as T;
  } catch (e) {
    return fallback;
  }
}
