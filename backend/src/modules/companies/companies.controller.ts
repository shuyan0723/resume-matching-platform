import { Controller, Get, Post, Put, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CompaniesService } from './companies.service';
import { Company } from './company.entity';

@ApiTags('公司')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前公司信息' })
  async getCompany(@Request() req) {
    const company = await this.companiesService.findByUserId(req.user.id);
    if (company) {
      return this.companiesService.getCompany(company.id);
    }
    return null;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建公司信息' })
  async create(@Request() req, @Body() createDto: Partial<Company>) {
    // 关联当前用户ID
    createDto.userId = req.user.id;
    return this.companiesService.create(createDto);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新公司信息' })
  async update(@Request() req, @Body() updateDto: Partial<Company>) {
    const company = await this.companiesService.findByUserId(req.user.id);
    if (!company) {
      // TODO: 抛出未找到异常
      return null;
    }
    return this.companiesService.update(company.id, updateDto);
  }

  @Get('by-user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '根据用户ID查询公司信息' })
  async findByUserId(@Request() req) {
    return this.companiesService.findByUserId(req.user.id);
  }
}
