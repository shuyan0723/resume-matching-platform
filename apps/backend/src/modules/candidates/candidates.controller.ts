import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CandidatesService } from './candidates.service';
import { Candidate } from './candidate.entity';

@ApiTags('候选人')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前候选人资料' })
  async getProfile(@Request() req) {
    const candidate = await this.candidatesService.findByUserId(req.user.id);
    if (candidate) {
      return this.candidatesService.getProfile(candidate.id);
    }
    return null;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建候选人资料' })
  async create(@Request() req, @Body() createDto: Partial<Candidate>) {
    // 关联当前用户ID
    createDto.userId = req.user.id;
    return this.candidatesService.create(createDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新候选人资料' })
  async update(@Request() req, @Body() updateDto: Partial<Candidate>) {
    const candidate = await this.candidatesService.findByUserId(req.user.id);
    if (!candidate) {
      // TODO: 抛出未找到异常
      return null;
    }
    return this.candidatesService.update(candidate.id, updateDto);
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据用户ID查询候选人资料' })
  async findByUserId(@Request() req) {
    return this.candidatesService.findByUserId(req.user.id);
  }
}
