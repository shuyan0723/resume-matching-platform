import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export type LLMProvider = 'openai' | 'qwen' | 'ollama' | 'custom' | 'mock';

/**
 * AI 配置中心
 *
 * 所有 LLM / Embedding 相关参数都通过 .env 注入，无需改代码即可切换：
 *
 *   LLM_PROVIDER        # openai | qwen | ollama | custom | mock   (默认 mock，离线可用)
 *   LLM_BASE_URL        # 兼容 OpenAI 协议的接口根地址，如 https://dashscope.aliyuncs.com/compatible-mode/v1
 *   LLM_API_KEY         # 接口密钥
 *   LLM_MODEL           # 模型名，如 qwen-plus | gpt-4o-mini | qwen2.5:7b
 *   LLM_TIMEOUT_MS      # 单次请求超时（ms），默认 60000
 *   LLM_MAX_RETRIES     # 失败重试次数，默认 1
 *
 *   EMBEDDING_BASE_URL  # 若 embedding 走另一个端点
 *   EMBEDDING_API_KEY
 *   EMBEDDING_MODEL     # 如 text-embedding-v3 | bge-m3
 *
 * 注意：PROVIDER=mock 或未配置 LLM_BASE_URL 时，AI 服务会自动走「规则/空数据降级」，
 * 不影响 resumes、jobs、matching 主流程。待你提供真实 LLM 接口后，填 .env 即可启用。
 */
@Injectable()
export class AiConfig {
  constructor(private readonly configService: ConfigService) {}

  get provider(): LLMProvider {
    const v = (this.configService.get<string>('LLM_PROVIDER') || 'mock').toLowerCase();
    if (['openai', 'qwen', 'ollama', 'custom', 'mock'].includes(v)) return v as LLMProvider;
    return 'mock';
  }

  get baseURL(): string | undefined {
    return this.configService.get<string>('LLM_BASE_URL')?.replace(/\/$/, '');
  }

  get apiKey(): string | undefined {
    return this.configService.get<string>('LLM_API_KEY');
  }

  get model(): string {
    return this.configService.get<string>('LLM_MODEL') || 'gpt-4o-mini';
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
