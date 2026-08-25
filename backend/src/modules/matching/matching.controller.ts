import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
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
  @ApiQuery({ name: 'resumeId', required: false, description: '简历ID' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  async matchJobs(
    @Request() req,
    @Query('resumeId') resumeId?: string,
    @Query('limit') limit?: string,
  ) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    return this.matchingService.matchJobs(
      candidateId,
      resumeId ? Number(resumeId) : undefined,
      limit ? Number(limit) : 10,
    );
  }

  @Get('candidates')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '为职位匹配候选人' })
  @ApiQuery({ name: 'jobId', required: true, description: '职位ID' })
  @ApiQuery({ name: 'limit', required: false, description: '返回数量' })
  async matchCandidates(
    @Query('jobId') jobId: string,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.matchCandidates(
      Number(jobId),
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
    const score = await this.matchingService.calculateMatchScore(
      body.resumeId,
      body.jobId,
    );
    return { score };
  }
}
