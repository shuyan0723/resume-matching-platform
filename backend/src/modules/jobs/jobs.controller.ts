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
  @ApiOperation({ summary: '创建职位' })
  async create(@Request() req, @Body() createDto: Partial<Job>) {
    // TODO: 根据用户ID获取公司ID
    const companyId = req.user.companyId || 1;
    return this.jobsService.create(companyId, createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取职位列表（分页）' })
  @ApiQuery({ name: 'page', required: false, description: '页码' })
  @ApiQuery({ name: 'pageSize', required: false, description: '每页数量' })
  @ApiQuery({ name: 'keyword', required: false, description: '搜索关键词' })
  async findAll(@Query() paginationDto: PaginationDto, @Query('keyword') keyword?: string) {
    return this.jobsService.findAll(paginationDto, { keyword });
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
  @ApiOperation({ summary: '发布职位' })
  async publish(@Param('id') id: string) {
    return this.jobsService.publish(Number(id));
  }

  @Put(':id/close')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '关闭职位' })
  async close(@Param('id') id: string) {
    return this.jobsService.close(Number(id));
  }
}
