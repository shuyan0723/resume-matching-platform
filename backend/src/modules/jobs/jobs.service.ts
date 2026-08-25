import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './job.entity';
import {
  PaginationDto,
  PaginatedResult,
  createPaginatedResult,
} from '../../common/dto/pagination.dto';

/**
 * 职位服务
 * 提供职位的增删改查、发布、关闭等业务逻辑
 */
@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobsRepository: Repository<Job>,
  ) {}

  /**
   * 创建职位
   * @param companyId 公司ID
   * @param jobData 职位数据
   * @returns 创建后的职位
   */
  async create(companyId: number, jobData: Partial<Job>): Promise<Job> {
    const job = this.jobsRepository.create({
      ...jobData,
      companyId,
    });
    return this.jobsRepository.save(job);
  }

  /**
   * 分页查询职位列表
   * @param paginationDto 分页参数
   * @param filters 过滤条件
   * @returns 分页结果
   */
  async findAll(
    paginationDto: PaginationDto,
    filters?: Record<string, any>,
  ): Promise<PaginatedResult<Job>> {
    const queryBuilder = this.jobsRepository.createQueryBuilder('job');

    // 默认只显示已发布的职位
    if (!filters?.status) {
      queryBuilder.where('job.status = :status', { status: JobStatus.OPEN });
    } else {
      queryBuilder.where('job.status = :status', { status: filters.status });
    }

    // 按公司过滤
    if (filters?.companyId) {
      queryBuilder.andWhere('job.company_id = :companyId', { companyId: filters.companyId });
    }

    // 关键词搜索
    if (filters?.keyword) {
      queryBuilder.andWhere('(job.title LIKE :keyword OR job.description LIKE :keyword)', {
        keyword: `%${filters.keyword}%`,
      });
    }

    // 排序：按是否紧急、发布时间排序
    queryBuilder.orderBy('job.urgent', 'DESC');
    queryBuilder.addOrderBy('job.published_at', 'DESC');

    // 分页
    queryBuilder.skip(paginationDto.skip).take(paginationDto.pageSize);

    const [list, total] = await queryBuilder.getManyAndCount();

    return createPaginatedResult(list, total, paginationDto.page, paginationDto.pageSize);
  }

  /**
   * 根据ID查询单个职位
   * @param id 职位ID
   * @returns 职位详情
   */
  async findOne(id: number): Promise<Job | undefined> {
    return this.jobsRepository.findOne({
      where: { id },
      relations: ['company'],
    });
  }

  /**
   * 更新职位信息
   * @param id 职位ID
   * @param updateData 更新数据
   * @returns 更新后的职位
   */
  async update(id: number, updateData: Partial<Job>): Promise<Job> {
    await this.jobsRepository.update(id, updateData);
    return this.jobsRepository.findOne({ where: { id } });
  }

  /**
   * 删除职位
   * @param id 职位ID
   * @returns 删除结果
   */
  async remove(id: number): Promise<void> {
    await this.jobsRepository.delete(id);
  }

  /**
   * 发布职位
   * @param id 职位ID
   * @returns 发布后的职位
   */
  async publish(id: number): Promise<Job> {
    await this.jobsRepository.update(id, {
      status: JobStatus.OPEN,
      publishedAt: new Date(),
    });
    return this.jobsRepository.findOne({ where: { id } });
  }

  /**
   * 关闭职位
   * @param id 职位ID
   * @returns 关闭后的职位
   */
  async close(id: number): Promise<Job> {
    await this.jobsRepository.update(id, {
      status: JobStatus.CLOSED,
      closedAt: new Date(),
    });
    return this.jobsRepository.findOne({ where: { id } });
  }

  /**
   * 增加职位浏览次数
   * @param id 职位ID
   * @returns 更新结果
   */
  async incrementViewCount(id: number): Promise<void> {
    await this.jobsRepository
      .createQueryBuilder()
      .update(Job)
      .set({ viewCount: () => 'view_count + 1' })
      .where('id = :id', { id })
      .execute();
  }
}
