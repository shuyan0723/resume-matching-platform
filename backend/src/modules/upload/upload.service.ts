import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * 文件上传服务
 * 提供文件上传、存储路径管理、文件验证等功能
 */
@Injectable()
export class UploadService {
  /**
   * 上传文件
   * @param file 上传的文件对象
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
    // TODO: 根据 uploadType 确定存储目录
    // TODO: 验证文件类型和大小
    // TODO: 可能需要生成缩略图等

    const fileName = this.generateFileName(file.originalname);
    const relativePath = join('uploads', uploadType, fileName);

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
        // TODO: 根据类型创建不同目录
        const uploadDir = `./uploads/${uploadType}`;
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
