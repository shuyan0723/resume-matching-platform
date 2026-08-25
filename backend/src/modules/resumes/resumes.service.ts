import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue, Processor, Process } from '@nestjs/bull';
import { Queue, Job } from 'bull';
import { Repository } from 'typeorm';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { extname } from 'path';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import { Resume, ParseStatus } from './resume.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
import { Project } from './project.entity';
import { AiService } from '../ai/ai.service';

/**
 * 简历服务
 * 提供简历的上传、解析、管理等业务逻辑
 * 使用 Bull 队列进行异步解析处理
 */
@Injectable()
@Processor('resume-parse')
export class ResumesService {
  constructor(
    @InjectRepository(Resume)
    private resumesRepository: Repository<Resume>,
    @InjectRepository(WorkExperience)
    private workExperienceRepository: Repository<WorkExperience>,
    @InjectRepository(Education)
    private educationRepository: Repository<Education>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectQueue('resume-parse')
    private resumeParseQueue: Queue,
    private readonly aiService: AiService,
  ) {}

  /**
   * 上传简历文件（已通过 Controller 层校验）
   * @param candidateId 候选人ID
   * @param fileInfo 经过 UploadService 处理的文件信息
   * @returns 创建的简历记录
   */
  async upload(
    candidateId: number,
    fileInfo: {
      fileName: string;
      originalName: string;
      filePath: string;
      fileSize: number;
      fileType: string;
      url: string;
    },
  ): Promise<Resume> {
    const resume = this.resumesRepository.create({
      candidateId,
      title: fileInfo.originalName?.replace(/\.[^.]+$/, '') || '未命名简历',
      fileName: fileInfo.originalName || fileInfo.fileName,
      filePath: fileInfo.filePath,
      fileSize: fileInfo.fileSize || 0,
      fileType: fileInfo.fileType || '',
      parseStatus: ParseStatus.PENDING,
      isDefault: 0,
    });

    const savedResume = await this.resumesRepository.save(resume);

    // 如果是候选人的第一份简历，自动设为默认
    const allResumes = await this.resumesRepository.find({ where: { candidateId } });
    if (allResumes.length === 1) {
      await this.resumesRepository.update(savedResume.id, { isDefault: 1 });
      savedResume.isDefault = 1;
    }

    // 立即将解析任务加入异步队列
    await this.resumeParseQueue.add(
      {
        resumeId: savedResume.id,
        filePath: savedResume.filePath,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );

    return savedResume;
  }

  /**
   * 触发简历解析
   * @param resumeId 简历ID
   * @returns 解析任务信息
   */
  async parse(resumeId: number): Promise<{ jobId: string; status: string }> {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId } });
    if (!resume) {
      throw new NotFoundException('简历不存在，无法触发解析');
    }

    await this.resumesRepository.update(resumeId, { parseStatus: ParseStatus.PENDING });

    const job = await this.resumeParseQueue.add(
      {
        resumeId: resume.id,
        filePath: resume.filePath,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: 50,
      },
    );

    return {
      jobId: job.id.toString(),
      status: 'processing',
    };
  }

  /**
   * 根据候选人ID查询简历列表
   * @param candidateId 候选人ID
   * @returns 简历列表
   */
  async findByCandidateId(candidateId: number): Promise<Resume[]> {
    return this.resumesRepository.find({
      where: { candidateId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * 根据ID查询单个简历
   * @param id 简历ID
   * @returns 简历详情
   */
  async findOne(id: number): Promise<Resume | undefined> {
    return this.resumesRepository.findOne({
      where: { id },
      relations: ['workExperiences', 'educations', 'projects'],
    });
  }

  /**
   * 更新简历信息
   * @param id 简历ID
   * @param updateData 更新数据
   * @returns 更新后的简历
   */
  async update(id: number, updateData: Partial<Resume>): Promise<Resume> {
    await this.resumesRepository.update(id, updateData);
    return this.resumesRepository.findOne({ where: { id } });
  }

  /**
   * 删除简历（含关联经历 + 物理文件）
   * @param id 简历ID
   */
  async remove(id: number): Promise<void> {
    const resume = await this.resumesRepository.findOne({
      where: { id },
      relations: ['workExperiences', 'educations', 'projects'],
    });
    if (!resume) {
      throw new NotFoundException('简历不存在，无法删除');
    }

    // 1. 删除关联经历
    if (resume.workExperiences?.length) {
      await this.workExperienceRepository.remove(resume.workExperiences);
    }
    if (resume.educations?.length) {
      await this.educationRepository.remove(resume.educations);
    }
    if (resume.projects?.length) {
      await this.projectRepository.remove(resume.projects);
    }

    // 2. 删除物理文件（文件不存在时忽略）
    try {
      if (resume.filePath && existsSync(resume.filePath)) {
        unlinkSync(resume.filePath);
      }
    } catch (_) {
      // 文件删除失败不影响数据库删除
    }

    // 3. 删除简历主记录
    await this.resumesRepository.delete(id);
  }

  /**
   * 设置默认简历
   * @param candidateId 候选人ID
   * @param resumeId 简历ID
   * @returns 更新结果
   */
  async setDefault(candidateId: number, resumeId: number): Promise<void> {
    // 将该候选人的所有简历设为非默认
    await this.resumesRepository
      .createQueryBuilder()
      .update(Resume)
      .set({ isDefault: 0 })
      .where('candidate_id = :candidateId', { candidateId })
      .execute();

    // 将指定简历设为默认
    await this.resumesRepository.update(resumeId, { isDefault: 1 });
  }

  /**
   * 获取简历解析结果
   * @param resumeId 简历ID
   */
  async getParseResult(resumeId: number): Promise<{
    status: string;
    data: Record<string, any> | null;
    confidence: number | null;
  }> {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId } });
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }

    return {
      status: resume.parseStatus,
      data: resume.parsedData,
      confidence: resume.parseConfidence,
    };
  }

  // ---------------------------------------------------------------------------
  // Bull 队列消费者：处理 resume-parse 队列
  // 流程：更新 status -> 提取文件文本 -> 调 AiService.parseResume -> 存结构化数据
  // ---------------------------------------------------------------------------
  @Process({ name: '__default__', concurrency: 2 })
  async handleResumeParse(job: Job<{ resumeId: number; filePath: string }>) {
    const { resumeId, filePath } = job.data;
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId } });
    if (!resume) {
      return;
    }

    try {
      // 1. 标记为解析中
      await this.resumesRepository.update(resumeId, { parseStatus: ParseStatus.PROCESSING });

      // 2. 从文件提取纯文本（真实读取磁盘文件）
      let rawText = '';
      if (existsSync(filePath)) {
        const ext = extname(filePath).toLowerCase();
        const buffer = readFileSync(filePath);
        if (ext === '.pdf') {
          const pdfResult = await pdfParse(buffer);
          rawText = pdfResult.text || '';
        } else if (ext === '.docx') {
          const mammothResult = await mammoth.extractRawText({ buffer });
          rawText = mammothResult.value || '';
        } else if (ext === '.doc') {
          // .doc 是二进制老格式，mammoth 不支持；先读原始字节当 fallback
          rawText = buffer.toString('utf-8');
        } else {
          rawText = buffer.toString('utf-8');
        }
      }

      // 3. 调 AiService 解析（等用户给了 LLM Key 后，parseResume 会返回真实大模型结果）
      const parsed = await this.aiService.parseResume(rawText, resume.fileType || extname(filePath));

      // 4. 写入解析结果到主表
      await this.resumesRepository.update(resumeId, {
        parseStatus: ParseStatus.COMPLETED,
        parseConfidence: parsed.confidence || 0,
        parsedData: parsed as any,
        skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      });

      // 5. 写入工作经历
      if (Array.isArray(parsed.workExperience) && parsed.workExperience.length > 0) {
        const workEntities = parsed.workExperience.map((item: any, idx: number) => {
          const endRaw = item.endDate;
          // "至今" / "Present" / 空 都视为在职
          const stillNow =
            !endRaw ||
            ['至今', '现在', '目前', 'present', 'current', 'now', ''].includes(String(endRaw).trim().toLowerCase());
          return this.workExperienceRepository.create({
            resumeId,
            companyName: item.company || item.companyName || '',
            position: item.position || '',
            startDate: this._safeParseDate(item.startDate),
            endDate: stillNow ? null : this._safeParseDate(endRaw),
            isCurrent: stillNow || !!item.isCurrent ? 1 : 0,
            description:
              item.description ||
              (Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : item.responsibilities) ||
              (Array.isArray(item.highlights) ? item.highlights.join('\n') : item.highlights) ||
              '',
            skills: Array.isArray(item.skills) ? item.skills : [],
            sortOrder: idx,
          });
        });
        await this.workExperienceRepository.save(workEntities);
      }

      // 6. 写入教育经历
      if (Array.isArray(parsed.education) && parsed.education.length > 0) {
        const eduEntities = parsed.education.map((item: any, idx: number) =>
          this.educationRepository.create({
            resumeId,
            schoolName: item.school || item.schoolName || '',
            degree: item.degree || item.education || null,
            major: item.major || null,
            startDate: this._safeParseDate(item.startDate),
            endDate: this._safeParseDate(item.endDate),
            description: item.description || null,
            gpa: Number.isFinite(Number(item.gpa)) ? Number(item.gpa) : null,
            sortOrder: idx,
          }),
        );
        await this.educationRepository.save(eduEntities);
      }

      // 7. 写入项目经历
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        const projEntities = parsed.projects.map((item: any, idx: number) =>
          this.projectRepository.create({
            resumeId,
            name: item.name || item.projectName || '',
            role: item.role || null,
            startDate: this._safeParseDate(item.startDate),
            endDate: this._safeParseDate(item.endDate),
            description:
              item.description ||
              (Array.isArray(item.highlights) ? item.highlights.join('\n') : item.highlights) ||
              (Array.isArray(item.achievements) ? item.achievements.join('\n') : item.achievements) ||
              '',
            techStack: item.technologies || item.techStack || item.skills || [],
            sortOrder: idx,
          }),
        );
        await this.projectRepository.save(projEntities);
      }

      // 8. 异步触发向量化（失败不影响主流程）
      try {
        const vectorText = [
          parsed.summary,
          ...(parsed.skills || []),
          ...(parsed.workExperience || []).map((w: any) => `${w.company} ${w.position} ${w.description}`),
          ...(parsed.projects || []).map((p: any) => `${p.name} ${p.description}`),
        ]
          .filter(Boolean)
          .join(' ');
        if (vectorText) {
          const vec = await this.aiService.vectorize(vectorText);
          if (Array.isArray(vec) && vec.length > 0) {
            await this.resumesRepository.update(resumeId, {
              resumeVector: JSON.stringify(vec),
            });
          }
        }
      } catch (_) {
        // 向量失败不阻塞
      }
    } catch (err) {
      // 失败：写回 FAILED 状态
      const errMsg = err instanceof Error ? err.message : String(err);
      await this.resumesRepository.update(resumeId, {
        parseStatus: ParseStatus.FAILED,
        parsedData: { error: errMsg } as any,
      });
      // 抛给 Bull，走重试机制（attempts=2）
      throw err;
    }
  }

  /**
   * 将模型/简历文本返回的各种日期字符串安全转成 Date | null。
   * 支持：2024-06 / 2024.06 / 2024/06 / 2024年6月 / 2024-06-01。非法则返回 null。
   */
  private _safeParseDate(raw: any): Date | null {
    if (!raw) return null;
    if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw;
    let s = String(raw).trim();
    if (!s) return null;

    // 中文年月：2024年6月 / 2024年06月 / 2024年6月1日
    const cn = s.match(/^(\d{4})\s*年\s*(\d{1,2})\s*月(?:\s*(\d{1,2})\s*日?)?$/);
    if (cn) {
      const [, y, m, d] = cn;
      const iso = `${y}-${String(m).padStart(2, '0')}-${String(d || 1).padStart(2, '0')}`;
      return new Date(iso);
    }
    // 2024-06 / 2024-06-01
    let m = s.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
    if (!m) {
      // 2024.06 / 2024/06 / 2024.06.01 / 2024/06/01
      m = s.match(/^(\d{4})[./](\d{1,2})(?:[./](\d{1,2}))?$/);
    }
    if (m) {
      const [, y, mo, d] = m;
      const iso = `${y}-${String(mo).padStart(2, '0')}-${String(d || 1).padStart(2, '0')}`;
      const date = new Date(iso);
      return Number.isNaN(date.getTime()) ? null : date;
    }
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  }
}
