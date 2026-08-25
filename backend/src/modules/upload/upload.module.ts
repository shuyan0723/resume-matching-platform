import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';

/**
 * 文件上传模块
 * 负责各类文件的上传处理，包括简历文件、头像、公司Logo等
 * 使用 NestJS 的 MulterModule 处理文件上传
 */
@Module({
  imports: [
    MulterModule.register({
      // TODO: 配置文件存储路径、文件大小限制等
      dest: './uploads',
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
