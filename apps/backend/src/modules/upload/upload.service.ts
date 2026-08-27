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
   * 【静态】生成唯一文件名，Mul 存储配置 / 实例方法都可复用
   */
  static generateFileName(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    const uuid = uuidv4().replace(/-/g, '');
    return `${uuid}${ext}`;
  }

  /**
   * 【静态】Multer 磁盘存储配置，支持目录自动创建
   * （放在静态以便 UploadModule 在 inject UploadService 之前就能使用，避免 Nest 依赖循环）
   */
  static getStorageConfig(uploadType: string = 'general') {
    return diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = `./uploads/${uploadType}`;
        if (!existsSync(uploadDir)) {
          mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        cb(null, UploadService.generateFileName(file.originalname));
      },
    });
  }

  /**
   * 【静态】Multer 文件过滤器
   */
  static getFileFilter(allowedTypes: string[]) {
    return (
      req: any,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('不支持的文件类型'), false);
      }
    };
  }

  /**
   * 上传文件
   * @param file 上传的文件对象（Multer 已通过 FileInterceptor 落盘）
   * @param uploadType 上传类型（resume/avatar/logo等）
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

    const fileName = UploadService.generateFileName(file.originalname);
    const relativePath = join(uploadDir, fileName).replace(/\\/g, '/');

    // Multer 默认用 Latin-1 编码 originalname，中文会乱码
    // 需要将 Latin-1 转回 UTF-8
    const safeOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf8');

    return {
      fileName,
      originalName: safeOriginalName,
      filePath: relativePath,
      fileSize: file.size,
      fileType: file.mimetype,
      url: `/${relativePath}`,
    };
  }

  validateFileType(mimeType: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimeType);
  }

  validateFileSize(size: number, maxSize: number): boolean {
    return size <= maxSize;
  }

  /** 实例方法（对调用方兼容）：底层复用静态实现 */
  getStorageConfig(uploadType: string = 'general') {
    return UploadService.getStorageConfig(uploadType);
  }

  /** 实例方法（对调用方兼容） */
  getFileFilter(allowedTypes: string[]) {
    return UploadService.getFileFilter(allowedTypes);
  }
}
