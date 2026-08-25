import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';

/**
 * AI 模块
 * 封装 AI 能力，包括简历解析、JD 提取、简历优化建议、匹配理由生成、向量化等
 * 作为 AI 能力层供其他模块调用
 */
@Module({
  providers: [AiService],
  controllers: [AiController],
  exports: [AiService],
})
export class AiModule {}
