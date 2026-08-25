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
    MulterModule.registerAsync({
      useFactory: (uploadService: UploadService) => ({
        storage: uploadService.getStorageConfig('general'),
        fileFilter: uploadService.getFileFilter(ALLOWED_FILE_TYPES.general),
        limits: {
          fileSize: FILE_SIZE_LIMITS.general,
        },
      }),
      inject: [UploadService],
    }),
  ],
  providers: [UploadService],
  controllers: [UploadController],
  exports: [UploadService, MulterModule],
})
export class UploadModule {}
