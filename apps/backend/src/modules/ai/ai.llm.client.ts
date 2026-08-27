import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AiConfig } from './ai.config';
import type {
  ChatRole,
  ChatMessage,
  ChatCompletionOptions,
} from './ai.types';
export type { ChatRole, ChatMessage, ChatCompletionOptions } from './ai.types';

/**
 * 统一 HTTP 客户端（兼容 OpenAI Chat Completions / Embeddings 协议）
 * - 自动重试
 * - 超时保护
 * - 请求失败返回 null（调用方负责降级，不阻塞主流程）
 * - 详细日志便于 LLM 接口到位后调试
 */
@Injectable()
export class LlmHttpClient {
  private readonly logger = new Logger(LlmHttpClient.name);
  private readonly chatAxios: AxiosInstance;
  private readonly embedAxios: AxiosInstance;

  constructor(private readonly config: AiConfig) {
    this.chatAxios = axios.create({
      baseURL: config.baseURL || 'http://127.0.0.1:0', // provider=mock 时不会真正请求
      timeout: config.timeoutMs,
      headers: config.apiKey
        ? {
            Authorization: `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
    });
    this.embedAxios = axios.create({
      baseURL: config.embeddingBaseURL || 'http://127.0.0.1:0',
      timeout: config.timeoutMs,
      headers: config.embeddingApiKey
        ? {
            Authorization: `Bearer ${config.embeddingApiKey}`,
            'Content-Type': 'application/json',
          }
        : { 'Content-Type': 'application/json' },
    });
  }

  /**
   * 调用 Chat Completions，返回模型输出的纯文本；未配置/失败返回 null。
   */
  async createChatCompletion(
    messages: ChatMessage[],
    options: ChatCompletionOptions = {},
  ): Promise<string | null> {
    if (!this.config.llmAvailable) {
      this.logger.debug('LLM 未配置，跳过 createChatCompletion（请在 .env 填入 LLM_BASE_URL/LLM_API_KEY 后启用）');
      return null;
    }
    const body: Record<string, any> = {
      model: this.config.model,
      messages,
      temperature: options.temperature ?? 0.2,
      top_p: options.topP ?? 0.9,
    };
    if (options.maxTokens) body.max_tokens = options.maxTokens;
    if (options.responseFormat) body.response_format = options.responseFormat;

    return this._withRetries(
      'chat',
      async () => {
        const resp = await this.chatAxios.post<any>(
          '/chat/completions',
          body,
          options.timeoutMs ? { timeout: options.timeoutMs } : undefined,
        );
        const choice = resp.data?.choices?.[0];
        const text: string | undefined =
          choice?.message?.content ?? choice?.delta?.content ?? undefined;
        if (typeof text !== 'string') {
          this.logger.warn(`LLM chat 返回格式异常: ${JSON.stringify(resp.data).slice(0, 300)}`);
          return null;
        }
        return text;
      },
    );
  }

  /**
   * 调用 Embeddings 接口，单条文本 → number[]；失败/未配置返回 null。
   */
  async createEmbedding(text: string): Promise<number[] | null> {
    if (!this.config.embeddingAvailable) return null;
    return this._withRetries('embedding', async () => {
      const resp = await this.embedAxios.post<any>('/embeddings', {
        model: this.config.embeddingModel,
        input: text,
      });
      const vec = resp.data?.data?.[0]?.embedding as number[] | undefined;
      if (!Array.isArray(vec)) return null;
      return vec.map(Number);
    });
  }

  async createEmbeddingBatch(texts: string[]): Promise<Array<number[] | null>> {
    // 兼容 embedding 端点：部分模型支持 batch，这里逐条请求以最大化兼容
    const out: Array<number[] | null> = [];
    for (const t of texts) out.push(await this.createEmbedding(t));
    return out;
  }

  private async _withRetries<T>(
    kind: 'chat' | 'embedding',
    fn: () => Promise<T | null>,
  ): Promise<T | null> {
    const maxRetries = this.config.maxRetries;
    let lastErr: any = null;
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (err: any) {
        lastErr = err;
        const status = err?.response?.status;
        const msg = err?.message || String(err);
        this.logger.warn(
          `[${kind}] 第 ${i + 1}/${maxRetries + 1} 次请求失败 status=${status ?? 'none'}: ${msg.slice(0, 200)}`,
        );
        // 4xx 不重试（鉴权/参数问题，重试无意义）
        if (status && status >= 400 && status < 500) break;
        if (i < maxRetries) {
          await new Promise((r) => setTimeout(r, 300 * (i + 1)));
        }
      }
    }
    this.logger.error(`[${kind}] 最终失败: ${lastErr?.message ?? String(lastErr)}`);
    return null;
  }
}
