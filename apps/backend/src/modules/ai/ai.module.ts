import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { AiConfig } from './ai.config';
import { LlmHttpClient } from './ai.llm.client';

/**
 * AI 模块
 * 封装 AI 能力，包括简历解析、JD 提取、简历优化建议、匹配理由生成、向量化等
 * 作为 AI 能力层供其他模块调用
 *
 * LLM 接口接入方式：
 *   1. 在 backend/.env 填 LLM_PROVIDER / LLM_BASE_URL / LLM_API_KEY / LLM_MODEL
 *   2. 重启 Nest 服务，AiService 会打印启用日志
 *   3. 不填则走 Mock 降级：返回空结构 / 0 分，主流程不阻塞
 */
@Module({
  providers: [AiConfig, LlmHttpClient, AiService],
  controllers: [AiController],
  exports: [AiService, AiConfig],
})
export class AiModule {}
