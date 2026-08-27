import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService, ALLOWED_FILE_TYPES, FILE_SIZE_LIMITS } from './upload.service';
import { UploadController } from './upload.controller';

/**
 * 文件上传模块
 * 负责各类文件的上传处理，包括简历文件、头像、公司Logo等
 * 使用 NestJS 的 MulterModule 处理文件上传
 */
@Module({
  imports: [
    // 注意：MulterModule 在 providers (UploadService) 初始化之前被解析，
    // 所以不能 inject UploadService，这里改为调用 UploadService 的静态方法。
    MulterModule.register({
      storage: UploadService.getStorageConfig('general'),
      fileFilter: UploadService.getFileFilter(ALLOWED_FILE_TYPES.general),
      limits: {
        fileSize: FILE_SIZE_LIMITS.general,
      },
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService, MulterModule],
})
export class UploadModule {}
