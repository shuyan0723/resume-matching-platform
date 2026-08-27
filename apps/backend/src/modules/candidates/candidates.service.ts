import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate } from './candidate.entity';

/**
 * 候选人服务
 * 提供候选人资料的增删改查等业务逻辑
 */
@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
  ) {}

  /**
   * 根据用户ID查找候选人资料
   * @param userId 用户ID
   * @returns 候选人资料
   */
  async findByUserId(userId: number): Promise<Candidate | undefined> {
    return this.candidatesRepository.findOne({
      where: { userId },
    });
  }

  /**
   * 创建候选人资料
   * @param candidateData 候选人数据
   * @returns 创建后的候选人资料
   */
  async create(candidateData: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidatesRepository.create(candidateData);
    return this.candidatesRepository.save(candidate);
  }

  /**
   * 更新候选人资料
   * @param id 候选人ID
   * @param updateData 更新数据
   * @returns 更新后的候选人资料
   */
  async update(id: number, updateData: Partial<Candidate>): Promise<Candidate> {
    await this.candidatesRepository.update(id, updateData);
    return this.candidatesRepository.findOne({ where: { id } });
  }

  /**
   * 获取候选人完整资料（包含简历等关联信息）
   * @param id 候选人ID
   * @returns 候选人完整资料
   */
  async getProfile(id: number): Promise<Candidate | undefined> {
    // TODO: 关联查询简历、工作经历等信息
    return this.candidatesRepository.findOne({
      where: { id },
      relations: ['resumes'],
    });
  }
}
