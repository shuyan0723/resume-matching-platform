import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './application.entity';

/**
 * 求职申请服务
 * 提供职位申请、申请查询、状态更新等业务逻辑
 */
@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  /**
   * 申请职位
   * @param candidateId 候选人ID
   * @param jobId 职位ID
   * @param resumeId 简历ID
   * @param companyId 公司ID
   * @returns 创建的申请记录
   */
  async apply(
    candidateId: number,
    jobId: number,
    resumeId: number,
    companyId: number,
  ): Promise<Application> {
    // TODO: 检查是否已申请过
    // TODO: 调用匹配服务计算匹配分数
    const application = this.applicationsRepository.create({
      candidateId,
      jobId,
      resumeId,
      companyId,
      status: ApplicationStatus.APPLIED,
      matchScore: null,
      matchDetail: null,
    });
    return this.applicationsRepository.save(application);
  }

  /**
   * 查询候选人的申请记录
   * @param candidateId 候选人ID
   * @returns 申请记录列表
   */
  async findByCandidate(candidateId: number): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { candidateId },
      order: { appliedAt: 'DESC' },
      relations: ['job', 'resume'],
    });
  }

  /**
   * 查询职位的申请记录
   * @param jobId 职位ID
   * @returns 申请记录列表
   */
  async findByJob(jobId: number): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { jobId },
      order: { appliedAt: 'DESC' },
      relations: ['candidate', 'resume'],
    });
  }

  /**
   * 更新申请状态
   * @param id 申请ID
   * @param status 新状态
   * @returns 更新后的申请记录
   */
  async updateStatus(id: number, status: ApplicationStatus): Promise<Application> {
    await this.applicationsRepository.update(id, { status });
    return this.applicationsRepository.findOne({ where: { id } });
  }

  /**
   * 获取申请详情
   * @param id 申请ID
   * @returns 申请详情
   */
  async getApplicationDetail(id: number): Promise<Application | undefined> {
    return this.applicationsRepository.findOne({
      where: { id },
      relations: ['job', 'resume', 'candidate', 'company'],
    });
  }
}
