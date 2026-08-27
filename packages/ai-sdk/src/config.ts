// =============================================================
// AI 配置中心（纯 TS，不依赖 NestJS）
//
// 所有 LLM / Embedding 相关参数通过 env 或传入对象注入：
//
//   LLM_PROVIDER        openai | qwen | ollama | custom | mock   (默认 mock)
//   LLM_BASE_URL        兼容 OpenAI 协议的接口根地址
//   LLM_API_KEY         接口密钥
//   LLM_MODEL           模型名，如 qwen-plus | gpt-4o-mini
//   LLM_TIMEOUT_MS      单次请求超时（ms），默认 60000
//   LLM_MAX_RETRIES     失败重试次数，默认 1
//
//   EMBEDDING_BASE_URL   若 embedding 走另一个端点，否则复用 LLM_BASE_URL
//   EMBEDDING_API_KEY    否则复用 LLM_API_KEY
//   EMBEDDING_MODEL      如 text-embedding-v3 | bge-m3
//
// provider=mock 或未配置 LLM_BASE_URL → 自动降级，不阻塞主流程
// =============================================================

export type LLMProvider = 'openai' | 'qwen' | 'ollama' | 'custom' | 'mock';

export interface AiSdkConfigOptions {
  provider?: string;
  baseURL?: string;
  apiKey?: string;
  model?: string;
  timeoutMs?: number;
  maxRetries?: number;
  embeddingBaseURL?: string;
  embeddingApiKey?: string;
  embeddingModel?: string;
}

/** 从 process.env 构建（服务端通用入口） */
export function loadAiConfigFromEnv(env: Record<string, string | undefined> = process.env): AiSdkConfigOptions {
  const pick = (a: string, b: string): string | undefined => {
    const va = env[a];
    if (va !== undefined && va !== '') return va;
    return env[b];
  };
  return {
    provider: pick('LLM_PROVIDER', 'AI_PROVIDER'),
    baseURL: pick('LLM_BASE_URL', 'AI_BASE_URL'),
    apiKey: pick('LLM_API_KEY', 'AI_API_KEY'),
    model: pick('LLM_MODEL', 'AI_MODEL'),
    timeoutMs: env['LLM_TIMEOUT_MS'] ? Number(env['LLM_TIMEOUT_MS']) : undefined,
    maxRetries: env['LLM_MAX_RETRIES'] ? Number(env['LLM_MAX_RETRIES']) : undefined,
    embeddingBaseURL: env['EMBEDDING_BASE_URL'],
    embeddingApiKey: env['EMBEDDING_API_KEY'],
    embeddingModel: env['EMBEDDING_MODEL'],
  };
}

export class AiSdkConfig {
  readonly provider: LLMProvider;
  readonly baseURL: string | undefined;
  readonly apiKey: string | undefined;
  readonly model: string;
  readonly timeoutMs: number;
  readonly maxRetries: number;
  readonly embeddingBaseURL: string | undefined;
  readonly embeddingApiKey: string | undefined;
  readonly embeddingModel: string;

  constructor(opts: AiSdkConfigOptions = {}) {
    const v = (opts.provider || 'mock').toLowerCase();
    this.provider = (['openai', 'qwen', 'ollama', 'custom', 'mock'].includes(v) ? v : 'mock') as LLMProvider;
    this.baseURL = opts.baseURL?.replace(/\/$/, '');
    this.apiKey = opts.apiKey;
    this.model = opts.model || 'gpt-4o-mini';
    this.timeoutMs = opts.timeoutMs || 60000;
    this.maxRetries = (typeof opts.maxRetries === 'number' && opts.maxRetries >= 0) ? opts.maxRetries : 1;
    this.embeddingBaseURL = opts.embeddingBaseURL?.replace(/\/$/, '') || this.baseURL;
    this.embeddingApiKey = opts.embeddingApiKey || this.apiKey;
    this.embeddingModel = opts.embeddingModel || 'text-embedding-3-small';
  }

  get llmAvailable(): boolean {
    if (this.provider === 'mock') return false;
    return !!this.baseURL;
  }

  get embeddingAvailable(): boolean {
    if (this.provider === 'mock') return false;
    return !!this.embeddingBaseURL;
  }
}
