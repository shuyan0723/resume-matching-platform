import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

/**
 * 公司服务
 * 提供公司信息的增删改查等业务逻辑
 */
@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  /**
   * 根据用户ID查找公司信息
   * @param userId 用户ID
   * @returns 公司信息
   */
  async findByUserId(userId: number): Promise<Company | undefined> {
    return this.companiesRepository.findOne({
      where: { userId },
    });
  }

  /**
   * 创建公司信息
   * @param companyData 公司数据
   * @returns 创建后的公司信息
   */
  async create(companyData: Partial<Company>): Promise<Company> {
    const company = this.companiesRepository.create(companyData);
    return this.companiesRepository.save(company);
  }

  /**
   * 更新公司信息
   * @param id 公司ID
   * @param updateData 更新数据
   * @returns 更新后的公司信息
   */
  async update(id: number, updateData: Partial<Company>): Promise<Company> {
    await this.companiesRepository.update(id, updateData);
    return this.companiesRepository.findOne({ where: { id } });
  }

  /**
   * 获取公司完整信息（包含职位等关联信息）
   * @param id 公司ID
   * @returns 公司完整信息
   */
  async getCompany(id: number): Promise<Company | undefined> {
    // TODO: 关联查询职位、统计信息等
    return this.companiesRepository.findOne({
      where: { id },
      relations: ['jobs'],
    });
  }
}
