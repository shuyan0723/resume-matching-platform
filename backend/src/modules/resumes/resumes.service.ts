import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Repository } from 'typeorm';
import { Resume } from './resume.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
import { Project } from './project.entity';

/**
 * 简历服务
 * 提供简历的上传、解析、管理等业务逻辑
 * 使用 Bull 队列进行异步解析处理
 */
@Injectable()
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
  ) {}

  /**
   * 上传简历文件
   * @param candidateId 候选人ID
   * @param fileData 文件数据
   * @returns 创建的简历记录
   */
  async upload(candidateId: number, fileData: any): Promise<Resume> {
    // TODO: 保存文件并创建简历记录
    const resume = this.resumesRepository.create({
      candidateId,
      title: fileData.originalname || '未命名简历',
      fileName: fileData.originalname || '',
      filePath: fileData.path || '',
      fileSize: fileData.size || 0,
      fileType: fileData.mimetype || '',
    });
    const savedResume = await this.resumesRepository.save(resume);

    // 将解析任务加入队列
    await this.resumeParseQueue.add({
      resumeId: savedResume.id,
      filePath: savedResume.filePath,
    });

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
      // TODO: 抛出未找到异常
      return { jobId: '', status: 'failed' };
    }

    // 将解析任务加入队列
    const job = await this.resumeParseQueue.add({
      resumeId: resume.id,
      filePath: resume.filePath,
    });

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
   * 删除简历
   * @param id 简历ID
   * @returns 删除结果
   */
  async remove(id: number): Promise<void> {
    // TODO: 同时删除关联的工作经历、教育经历、项目经历和文件
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
   * @returns 解析结果
   */
  async getParseResult(resumeId: number): Promise<{
    status: string;
    data: Record<string, any> | null;
    confidence: number | null;
  }> {
    const resume = await this.resumesRepository.findOne({ where: { id: resumeId } });
    if (!resume) {
      // TODO: 抛出未找到异常
      return { status: 'not_found', data: null, confidence: null };
    }

    return {
      status: resume.parseStatus,
      data: resume.parsedData,
      confidence: resume.parseConfidence,
    };
  }
}
