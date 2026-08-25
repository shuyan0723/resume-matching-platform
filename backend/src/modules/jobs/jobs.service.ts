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
   * @param options.defaultOnlyOpen 默认 true：未传 status 时仅返回 OPEN；企业端查自己时传 false 返回全部状态
   */
  async findAll(
    paginationDto: PaginationDto,
    filters?: Record<string, any>,
    options?: { defaultOnlyOpen?: boolean },
  ): Promise<PaginatedResult<Job>> {
    const defaultOnlyOpen = options?.defaultOnlyOpen !== false;
    const queryBuilder = this.jobsRepository.createQueryBuilder('job');

    // 状态过滤
    if (filters?.status) {
      queryBuilder.where('job.status = :status', { status: filters.status });
    } else if (defaultOnlyOpen) {
      queryBuilder.where('job.status = :status', { status: JobStatus.OPEN });
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
   * 发布/开启职位
   * @param id 职位ID
   * @returns 更新后的职位
   */
  async publish(id: number): Promise<Job> {
    await this.jobsRepository.update(id, {
      status: JobStatus.OPEN,
      publishedAt: new Date(),
    });
    return this.jobsRepository.findOne({ where: { id } });
  }

  /**
   * 暂停招聘（职位仍存在，但对求职者不再展示）
   * @param id 职位ID
   */
  async pause(id: number): Promise<Job> {
    await this.jobsRepository.update(id, {
      status: JobStatus.PAUSED,
    });
    return this.jobsRepository.findOne({ where: { id } });
  }

  /**
   * 关闭职位（结束招聘）
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
