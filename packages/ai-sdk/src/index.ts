// =============================================================
// @app/ai-sdk — 纯 TS 实现的 LLM 客户端 SDK
// 不依赖 NestJS，可被 backend / 脚本 / CLI 复用
// =============================================================

// --- 类型 ---
export type { ChatRole, ChatMessage, ChatCompletionOptions } from './types';
export type { LLMProvider } from './config';

// --- 配置 ---
export { AiSdkConfig } from './config';

// --- Prompt 模板 ---
export { AI_PROMPTS, safeParseJson } from './prompts';

// --- HTTP 客户端 ---
export { LlmClient } from './llm-client';
