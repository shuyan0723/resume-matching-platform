import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from './ai.service';

/**
 * AI 控制器
 * 注意：这是 AI 能力封装层，主要供其他模块内部调用
 * 仅暴露部分测试接口，不建议在生产环境直接暴露全部 AI 能力
 */
@ApiTags('AI 能力')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('parse-resume')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[测试] 解析简历文本' })
  async parseResume(@Body() body: { content: string; fileType?: string }) {
    return this.aiService.parseResume(body.content, body.fileType);
  }

  @Post('extract-jd')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[测试] 提取职位描述信息' })
  async extractJD(@Body() body: { jdText: string }) {
    return this.aiService.extractJD(body.jdText);
  }

  @Post('resume-suggestions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[测试] 生成简历优化建议' })
  async generateResumeSuggestions(
    @Body() body: { resumeData: Record<string, any>; jobDescription: string },
  ) {
    return this.aiService.generateResumeSuggestions(body.resumeData, body.jobDescription);
  }

  @Post('match-reason')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[测试] 生成匹配理由' })
  async generateMatchReason(
    @Body() body: {
      resumeData: Record<string, any>;
      jobData: Record<string, any>;
      matchScore: number;
    },
  ) {
    return this.aiService.generateMatchReason(
      body.resumeData,
      body.jobData,
      body.matchScore,
    );
  }

  @Post('vectorize')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[测试] 文本向量化' })
  async vectorize(@Body() body: { text: string }) {
    const vector = await this.aiService.vectorize(body.text);
    return { vector, dimension: vector.length };
  }
}
