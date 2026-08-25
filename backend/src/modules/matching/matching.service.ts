import { Injectable } from '@nestjs/common';
import { ResumesService } from '../resumes/resumes.service';
import { JobsService } from '../jobs/jobs.service';

/**
 * 匹配服务
 * 提供简历与职位的智能匹配、推荐、评分等业务逻辑
 */
@Injectable()
export class MatchingService {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly jobsService: JobsService,
  ) {}

  /**
   * 为求职者推荐匹配的岗位
   * @param candidateId 候选人ID
   * @param resumeId 简历ID（可选，不传则使用默认简历）
   * @param limit 返回数量限制
   * @returns 匹配的岗位列表及匹配分数
   */
  async matchJobs(
    candidateId: number,
    resumeId?: number,
    limit: number = 10,
  ): Promise<{ jobs: any[]; total: number }> {
    // TODO: 实现简历-职位匹配算法
    // 1. 获取候选人简历信息
    // 2. 获取所有开放职位
    // 3. 计算每份简历与每个职位的匹配分数
    // 4. 按匹配分数排序返回

    const resumes = await this.resumesService.findByCandidateId(candidateId);
    if (resumes.length === 0) {
      return { jobs: [], total: 0 };
    }

    // TODO: 使用向量相似度或关键词匹配计算匹配度
    // 暂时返回 mock 数据
    return {
      jobs: [
        {
          jobId: 1,
          title: '高级前端工程师',
          company: '示例公司',
          matchScore: 92.5,
          matchReason: '技能匹配度高，工作经验符合要求',
        },
      ],
      total: 1,
    };
  }

  /**
   * 为职位匹配候选人
   * @param jobId 职位ID
   * @param limit 返回数量限制
   * @returns 匹配的候选人列表及匹配分数
   */
  async matchCandidates(
    jobId: number,
    limit: number = 10,
  ): Promise<{ candidates: any[]; total: number }> {
    // TODO: 实现职位-候选人匹配算法
    // 1. 获取职位信息
    // 2. 获取所有候选人简历
    // 3. 计算每个候选人与职位的匹配分数
    // 4. 按匹配分数排序返回

    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      return { candidates: [], total: 0 };
    }

    // TODO: 使用向量相似度或关键词匹配计算匹配度
    // 暂时返回 mock 数据
    return {
      candidates: [
        {
          candidateId: 1,
          name: '张三',
          resumeId: 1,
          matchScore: 88.3,
          matchReason: '技能匹配，工作经验丰富',
        },
      ],
      total: 1,
    };
  }

  /**
   * 获取匹配详情
   * @param resumeId 简历ID
   * @param jobId 职位ID
   * @returns 匹配详情，包括各项匹配指标
   */
  async getMatchDetail(resumeId: number, jobId: number): Promise<{
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    locationMatch: number;
    salaryMatch: number;
    details: Record<string, any>;
  }> {
    // TODO: 实现详细匹配分析
    // 1. 获取简历和职位的详细信息
    // 2. 分别计算技能、经验、学历、地点、薪资等维度的匹配度
    // 3. 综合计算总匹配分数
    // 4. 生成匹配详情和建议

    const resume = await this.resumesService.findOne(resumeId);
    const job = await this.jobsService.findOne(jobId);

    if (!resume || !job) {
      return {
        overallScore: 0,
        skillMatch: 0,
        experienceMatch: 0,
        educationMatch: 0,
        locationMatch: 0,
        salaryMatch: 0,
        details: { error: '简历或职位不存在' },
      };
    }

    // TODO: 实际匹配逻辑
    return {
      overallScore: 85.0,
      skillMatch: 90,
      experienceMatch: 80,
      educationMatch: 85,
      locationMatch: 100,
      salaryMatch: 75,
      details: {
        matchedSkills: ['JavaScript', 'TypeScript', 'React'],
        missingSkills: ['Node.js'],
        experienceComment: '工作经验符合要求',
        educationComment: '学历达标',
        locationComment: '工作地点匹配',
        salaryComment: '薪资期望在范围内',
      },
    };
  }

  /**
   * 计算简历与职位的匹配分数
   * @param resumeId 简历ID
   * @param jobId 职位ID
   * @returns 匹配分数（0-100）
   */
  async calculateMatchScore(resumeId: number, jobId: number): Promise<number> {
    // TODO: 实现匹配分数计算
    // 可以基于向量相似度、关键词匹配、规则加权等方式计算

    const matchDetail = await this.getMatchDetail(resumeId, jobId);
    return matchDetail.overallScore;
  }
}
