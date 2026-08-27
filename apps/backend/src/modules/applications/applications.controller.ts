import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApplicationsService } from './applications.service';
import { ApplicationStatus } from './application.entity';

@ApiTags('求职申请')
@ApiBearerAuth()
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '申请职位' })
  async apply(
    @Request() req,
    @Body() applyDto: { jobId: number; resumeId: number; companyId: number },
  ) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    return this.applicationsService.apply(
      candidateId,
      applyDto.jobId,
      applyDto.resumeId,
      applyDto.companyId,
    );
  }

  @Get('by-candidate')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '查询候选人的申请记录' })
  async findByCandidate(@Request() req) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    return this.applicationsService.findByCandidate(candidateId);
  }

  @Get('by-job/:jobId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '查询职位的申请记录' })
  async findByJob(@Param('jobId') jobId: string) {
    return this.applicationsService.findByJob(Number(jobId));
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新申请状态' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ApplicationStatus },
  ) {
    return this.applicationsService.updateStatus(Number(id), body.status);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取申请详情' })
  async getApplicationDetail(@Param('id') id: string) {
    return this.applicationsService.getApplicationDetail(Number(id));
  }
}
