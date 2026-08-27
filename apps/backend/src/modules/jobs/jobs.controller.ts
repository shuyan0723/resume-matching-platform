import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JobsService } from './jobs.service';
import { Job } from './job.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('职位')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建职位（仅企业端）' })
  async create(@Request() req, @Body() createDto: Partial<Job>) {
    const companyId = req.user.companyId;
    if (!companyId) {
      throw new ForbiddenException('当前用户不是企业身份，无法发布职位');
    }
    return this.jobsService.create(companyId, createDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '企业端 - 查看自己公司的职位列表（含草稿/暂停/关闭）' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'pageSize', required: false })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'status', required: false, description: 'draft/open/paused/closed，默认返回全部' })
  async findMyCompanyJobs(
    @Request() req,
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
  ) {
    const companyId = req.user?.companyId;
    if (!companyId) {
      return { list: [], total: 0, page: 1, pageSize: 10, totalPages: 0 };
    }
    const filters: Record<string, any> = { companyId };
    if (keyword) filters.keyword = keyword;
    if (status) filters.status = status;
    // 企业端看自己公司：不需要默认只返回 OPEN
    return this.jobsService.findAll(paginationDto, filters, { defaultOnlyOpen: false });
  }

  @Get()
  @ApiOperation({ summary: '获取职位列表（公开，默认仅招聘中）' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词（职位名/描述）' })
  @ApiQuery({ name: 'status', required: false, description: '覆盖默认过滤：draft/open/paused/closed' })
  @ApiQuery({ name: 'companyId', required: false, description: '按公司筛选' })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query('keyword') keyword?: string,
    @Query('status') status?: string,
    @Query('companyId') companyId?: string,
  ) {
    const filters: Record<string, any> = {};
    if (keyword) filters.keyword = keyword;
    if (status) filters.status = status;
    if (companyId) filters.companyId = Number(companyId);
    return this.jobsService.findAll(paginationDto, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取职位详情' })
  async findOne(@Param('id') id: string) {
    // 增加浏览次数
    await this.jobsService.incrementViewCount(Number(id));
    return this.jobsService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新职位信息' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<Job>) {
    return this.jobsService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除职位' })
  async remove(@Param('id') id: string) {
    await this.jobsService.remove(Number(id));
    return { success: true };
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '发布/开启职位（状态 -> OPEN）' })
  async publish(@Param('id') id: string) {
    return this.jobsService.publish(Number(id));
  }

  @Put(':id/pause')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '暂停招聘（状态 -> PAUSED）' })
  async pause(@Param('id') id: string) {
    return this.jobsService.pause(Number(id));
  }

  @Put(':id/close')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '关闭职位（状态 -> CLOSED，结束招聘）' })
  async close(@Param('id') id: string) {
    return this.jobsService.close(Number(id));
  }
}
