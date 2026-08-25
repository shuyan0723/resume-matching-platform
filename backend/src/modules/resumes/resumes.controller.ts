import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumesService } from './resumes.service';
import { Resume } from './resume.entity';

@ApiTags('简历')
@ApiBearerAuth()
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: '上传简历文件' })
  async upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    return this.resumesService.upload(candidateId, file);
  }

  @Post(':id/parse')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '触发简历解析' })
  async parse(@Param('id') id: string) {
    return this.resumesService.parse(Number(id));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户的简历列表' })
  async findByCandidateId(@Request() req) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    return this.resumesService.findByCandidateId(candidateId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取简历详情' })
  async findOne(@Param('id') id: string) {
    return this.resumesService.findOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新简历信息' })
  async update(@Param('id') id: string, @Body() updateDto: Partial<Resume>) {
    return this.resumesService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除简历' })
  async remove(@Param('id') id: string) {
    await this.resumesService.remove(Number(id));
    return { success: true };
  }

  @Put(':id/default')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '设置默认简历' })
  async setDefault(@Request() req, @Param('id') id: string) {
    // TODO: 根据用户ID获取候选人ID
    const candidateId = req.user.candidateId || 1;
    await this.resumesService.setDefault(candidateId, Number(id));
    return { success: true };
  }

  @Get(':id/parse-result')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取简历解析结果' })
  async getParseResult(@Param('id') id: string) {
    return this.resumesService.getParseResult(Number(id));
  }
}
