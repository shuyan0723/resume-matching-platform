import { Controller, Get, Post, Body, Query, UseGuards, Request, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MatchingService } from './matching.service';

@ApiTags('智能匹配')
@ApiBearerAuth()
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Get('jobs')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '为求职者推荐匹配岗位' })
  @ApiQuery({ name: 'resumeId', required: false, description: '简历ID（不传用默认简历）' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  async matchJobs(
    @Request() req,
    @Query('resumeId') resumeId?: string,
    @Query('limit') limit?: string,
  ) {
    const candidateId = req.user.candidateId;
    if (!candidateId) {
      throw new ForbiddenException('当前用户不是求职者身份，无法获取岗位推荐');
    }
    return this.matchingService.matchJobs(
      candidateId,
      resumeId ? Number(resumeId) : undefined,
      limit ? Number(limit) : 10,
    );
  }

  @Get('candidates')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '为职位匹配候选人（仅企业端可用）' })
  @ApiQuery({ name: 'jobId', required: true, description: '职位ID' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  async matchCandidates(
    @Request() req,
    @Query('jobId') jobId: string,
    @Query('limit') limit?: string,
  ) {
    const companyId = req.user.companyId;
    if (!companyId) {
      throw new ForbiddenException('当前用户不是企业身份，无法查看候选人匹配');
    }
    if (!jobId) {
      throw new BadRequestException('缺少 jobId 参数');
    }
    return this.matchingService.matchCandidates(
      Number(jobId),
      companyId,
      limit ? Number(limit) : 10,
    );
  }

  @Get('detail')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取匹配详情' })
  @ApiQuery({ name: 'resumeId', required: true, description: '简历ID' })
  @ApiQuery({ name: 'jobId', required: true, description: '职位ID' })
  async getMatchDetail(
    @Query('resumeId') resumeId: string,
    @Query('jobId') jobId: string,
  ) {
    return this.matchingService.getMatchDetail(Number(resumeId), Number(jobId));
  }

  @Post('score')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '计算匹配分数' })
  async calculateMatchScore(@Body() body: { resumeId: number; jobId: number }) {
    if (!body.resumeId || !body.jobId) {
      throw new BadRequestException('resumeId 和 jobId 均为必填');
    }
    const score = await this.matchingService.calculateMatchScore(
      body.resumeId,
      body.jobId,
    );
    return { score };
  }
}
