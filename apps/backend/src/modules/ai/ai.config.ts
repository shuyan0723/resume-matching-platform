import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LLMProvider = 'openai' | 'qwen' | 'ollama' | 'custom' | 'mock';

/**
 * AI 配置中心
 *
 * 所有 LLM / Embedding 相关参数都通过 .env 注入，无需改代码即可切换：
 *
 *   新命名（推荐）      旧命名（兼容）     说明
 *   LLM_PROVIDER        AI_PROVIDER        openai | qwen | ollama | custom | mock   (默认 mock)
 *   LLM_BASE_URL        AI_BASE_URL        兼容 OpenAI 协议的接口根地址，例如 https://dashscope.aliyuncs.com/compatible-mode/v1
 *   LLM_API_KEY         AI_API_KEY         接口密钥
 *   LLM_MODEL           AI_MODEL           模型名，如 qwen-plus | gpt-4o-mini
 *   LLM_TIMEOUT_MS      —                  单次请求超时（ms），默认 60000
 *   LLM_MAX_RETRIES     —                  失败重试次数，默认 1
 *
 *   EMBEDDING_BASE_URL                      若 embedding 走另一个端点，否则复用 LLM_BASE_URL
 *   EMBEDDING_API_KEY                       否则复用 LLM_API_KEY
 *   EMBEDDING_MODEL                         如 text-embedding-v3 | bge-m3
 *
 * 注意：PROVIDER=mock 或未配置 LLM_BASE_URL 时，AI 服务自动走「规则/空数据降级」，
 * 不阻塞 resumes / jobs / matching 主流程。
 */
@Injectable()
export class AiConfig {
  constructor(private readonly configService: ConfigService) {}

  /** 优先读 LLM_*，若未定义则回退到 AI_* 旧命名（向后兼容） */
  private _pick(keyA: string, keyB: string): string | undefined {
    const a = this.configService.get<string>(keyA);
    if (a !== undefined && a !== '') return a;
    return this.configService.get<string>(keyB);
  }

  get provider(): LLMProvider {
    const v = (this._pick('LLM_PROVIDER', 'AI_PROVIDER') || 'mock').toLowerCase();
    if (['openai', 'qwen', 'ollama', 'custom', 'mock'].includes(v)) return v as LLMProvider;
    return 'mock';
  }

  get baseURL(): string | undefined {
    return this._pick('LLM_BASE_URL', 'AI_BASE_URL')?.replace(/\/$/, '');
  }

  get apiKey(): string | undefined {
    return this._pick('LLM_API_KEY', 'AI_API_KEY');
  }

  get model(): string {
    return this._pick('LLM_MODEL', 'AI_MODEL') || 'gpt-4o-mini';
  }

  get timeoutMs(): number {
    return Number(this.configService.get<number>('LLM_TIMEOUT_MS')) || 60000;
  }

  get maxRetries(): number {
    const v = Number(this.configService.get<number>('LLM_MAX_RETRIES'));
    return Number.isFinite(v) && v >= 0 ? v : 1;
  }

  get embeddingBaseURL(): string | undefined {
    return (
      this.configService.get<string>('EMBEDDING_BASE_URL')?.replace(/\/$/, '') || this.baseURL
    );
  }

  get embeddingApiKey(): string | undefined {
    return this.configService.get<string>('EMBEDDING_API_KEY') || this.apiKey;
  }

  get embeddingModel(): string {
    return this.configService.get<string>('EMBEDDING_MODEL') || 'text-embedding-3-small';
  }

  /**
   * 是否具备「真实 LLM 调用」条件。
   * 未配置或 provider=mock → 返回 false，走降级分支。
   */
  get llmAvailable(): boolean {
    if (this.provider === 'mock') return false;
    return !!this.baseURL;
  }

  get embeddingAvailable(): boolean {
    if (this.provider === 'mock') return false;
    return !!this.embeddingBaseURL;
  }
}
