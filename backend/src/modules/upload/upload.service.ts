import { Injectable, BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * 允许的文件类型（按上传类型分类）
 */
export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  resume: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  avatar: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  logo: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  general: ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'],
};

/**
 * 文件大小限制（字节）
 */
export const FILE_SIZE_LIMITS: Record<string, number> = {
  resume: 10 * 1024 * 1024,     // 10MB
  avatar: 2 * 1024 * 1024,      // 2MB
  logo: 2 * 1024 * 1024,        // 2MB
  general: 10 * 1024 * 1024,    // 10MB
};

/**
 * 文件上传服务
 * 提供文件上传、存储路径管理、文件验证等功能
 */
@Injectable()
export class UploadService {
  /**
   * 上传文件
   * @param file 上传的文件对象（Multer 已通过 FileInterceptor 落盘）
   * @param uploadType 上传类型（resume/avatar/logo等）
   * @returns 文件信息（文件名、路径、大小等）
   */
  async uploadFile(
    file: Express.Multer.File,
    uploadType: string = 'general',
  ): Promise<{
    fileName: string;
    originalName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
    url: string;
  }> {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    const allowedTypes = ALLOWED_FILE_TYPES[uploadType] || ALLOWED_FILE_TYPES.general;
    const maxSize = FILE_SIZE_LIMITS[uploadType] || FILE_SIZE_LIMITS.general;

    // 真实执行文件类型校验（配合 Multer filter 做双重保险）
    if (!this.validateFileType(file.mimetype, allowedTypes)) {
      throw new BadRequestException(
        `不支持的文件类型 ${file.mimetype}，${uploadType} 仅支持：${allowedTypes.join('、')}`,
      );
    }

    if (!this.validateFileSize(file.size, maxSize)) {
      throw new BadRequestException(
        `文件过大（${(file.size / 1024 / 1024).toFixed(2)}MB），限制为 ${(maxSize / 1024 / 1024)}MB`,
      );
    }

    const uploadDir = join('uploads', uploadType);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = this.generateFileName(file.originalname);
    const relativePath = join(uploadDir, fileName).replace(/\\/g, '/');

    return {
      fileName,
      originalName: file.originalname,
      filePath: relativePath,
      fileSize: file.size,
      fileType: file.mimetype,
      url: `/${relativePath}`,
    };
  }

  /**
   * 生成唯一文件名
   * @param originalName 原始文件名
   * @returns 生成的唯一文件名
   */
  private generateFileName(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const uuid = uuidv4().replace(/-/g, '');
    return `${uuid}${ext}`;
  }

  /**
   * 验证文件类型是否允许
   * @param mimeType 文件MIME类型
   * @param allowedTypes 允许的类型列表
   * @returns 是否允许
   */
  validateFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }

  /**
   * 验证文件大小是否在限制内
   * @param size 文件大小（字节）
   * @param maxSize 最大大小（字节）
   * @returns 是否在限制内
   */
  validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  /**
   * 获取 Multer 存储配置
   * @param uploadType 上传类型
   * @returns Multer 存储配置
   */
  getStorageConfig(uploadType: string = 'general') {
    return diskStorage({
      destination: (req, file, cb) => {
        // 真实根据类型创建目录，不存在则递归创建
        const uploadDir = `./uploads/${uploadType}`;
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const fileName = this.generateFileName(file.originalname);
        cb(null, fileName);
      },
    });
  }

  /**
   * 获取文件过滤器
   * @param allowedTypes 允许的MIME类型
   * @returns 文件过滤函数
   */
  getFileFilter(allowedTypes: string[]) {
    return (req: any, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
      if (this.validateFileType(file.mimetype, allowedTypes)) {
        cb(null, true);
      } else {
        cb(new Error('不支持的文件类型'), false);
      }
    };
  }
}
