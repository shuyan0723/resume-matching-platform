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
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { MulterModule } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResumesService } from './resumes.service';
import { Resume } from './resume.entity';
import { UploadService, ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from '../upload/upload.service';

@ApiTags('简历')
@ApiBearerAuth()
@Controller('resumes')
export class ResumesController {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: FILE_SIZE_LIMITS.resume },
  }))
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
  @ApiOperation({ summary: '上传简历文件（会触发异步AI解析队列）' })
  async upload(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const candidateId = req.user.candidateId;
    if (!candidateId) {
      throw new ForbiddenException('当前用户不是求职者身份，无法上传简历');
    }

    // 简历类型的强校验
    if (!this.uploadService.validateFileType(file.mimetype, ALLOWED_FILE_TYPES.resume)) {
      throw new BadRequestException(
        `不支持的文件类型：${file.mimetype}。简历仅支持 PDF、DOC、DOCX 格式`,
      );
    }
    if (!this.uploadService.validateFileSize(file.size, FILE_SIZE_LIMITS.resume)) {
      throw new BadRequestException(`简历文件过大，限制为 10MB`);
    }

    const fileInfo = await this.uploadService.uploadFile(file, 'resume');
    return this.resumesService.upload(candidateId, fileInfo);
  }

  @Post(':id/parse')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '手动触发简历解析' })
  async parse(@Request() req, @Param('id') id: string) {
    const candidateId = req.user.candidateId;
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (resume.candidateId !== candidateId) {
      throw new ForbiddenException('无权操作他人简历');
    }
    return this.resumesService.parse(Number(id));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取当前用户的简历列表' })
  async findByCandidateId(@Request() req) {
    const candidateId = req.user.candidateId;
    if (!candidateId) {
      return [];
    }
    return this.resumesService.findByCandidateId(candidateId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取简历详情' })
  async findOne(@Request() req, @Param('id') id: string) {
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    // 本人或企业端（未来扩展）可看
    if (req.user.candidateId && resume.candidateId !== req.user.candidateId) {
      throw new ForbiddenException('无权查看他人简历');
    }
    return resume;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新简历信息' })
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: Partial<Resume>) {
    const candidateId = req.user.candidateId;
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (candidateId && resume.candidateId !== candidateId) {
      throw new ForbiddenException('无权修改他人简历');
    }
    return this.resumesService.update(Number(id), updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除简历' })
  async remove(@Request() req, @Param('id') id: string) {
    const candidateId = req.user.candidateId;
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (candidateId && resume.candidateId !== candidateId) {
      throw new ForbiddenException('无权删除他人简历');
    }
    await this.resumesService.remove(Number(id));
    return { success: true };
  }

  @Put(':id/default')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '设置默认简历' })
  async setDefault(@Request() req, @Param('id') id: string) {
    const candidateId = req.user.candidateId;
    if (!candidateId) {
      throw new ForbiddenException('当前用户不是求职者身份');
    }
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (resume.candidateId !== candidateId) {
      throw new ForbiddenException('无权操作他人简历');
    }
    await this.resumesService.setDefault(candidateId, Number(id));
    return { success: true };
  }

  @Get(':id/parse-result')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取简历解析结果' })
  async getParseResult(@Request() req, @Param('id') id: string) {
    const candidateId = req.user.candidateId;
    const resume = await this.resumesService.findOne(Number(id));
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (candidateId && resume.candidateId !== candidateId) {
      throw new ForbiddenException('无权查看他人简历');
    }
    return this.resumesService.getParseResult(Number(id));
  }
}
