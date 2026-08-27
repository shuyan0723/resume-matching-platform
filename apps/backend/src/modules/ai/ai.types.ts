export type ChatRole = 'system' | 'user' | 'assistant';

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface ChatCompletionOptions {
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  responseFormat?: { type: 'json_object' | 'text' };
  /** 超时时间覆盖（毫秒） */
  timeoutMs?: number;
}
