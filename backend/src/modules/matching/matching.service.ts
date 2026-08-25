import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResumesService } from '../resumes/resumes.service';
import { JobsService } from '../jobs/jobs.service';
import { Job, JobStatus as JobJobStatus } from '../jobs/job.entity';
import { Resume } from '../resumes/resume.entity';
import { Candidate } from '../candidates/candidate.entity';
import { AiService } from '../ai/ai.service';

/**
 * 各项匹配权重（可调）
 */
const MATCH_WEIGHTS = {
  skill: 0.35,        // 技能匹配（权重最高）
  experience: 0.2,    // 工作经验
  education: 0.15,    // 学历
  location: 0.1,      // 工作地点
  salary: 0.1,        // 薪资
  vector: 0.1,        // 向量语义加成（接 Embedding 后生效）
};

const EDU_ORDER = ['high_school', 'college', 'bachelor', 'master', 'phd'];

@Injectable()
export class MatchingService {
  constructor(
    private readonly resumesService: ResumesService,
    private readonly jobsService: JobsService,
    private readonly aiService: AiService,
    @InjectRepository(Candidate)
    private readonly candidatesRepository: Repository<Candidate>,
  ) {}

  // -------------------------------------------------------------------------
  // 公开 API
  // -------------------------------------------------------------------------

  /**
   * 为求职者推荐匹配岗位（真实查 DB + 规则打分）
   */
  async matchJobs(
    candidateId: number,
    resumeId?: number,
    limit: number = 10,
  ): Promise<{ jobs: any[]; total: number }> {
    const resumes = await this.resumesService.findByCandidateId(candidateId);
    if (resumes.length === 0) {
      return { jobs: [], total: 0 };
    }

    // 优先用传入的 resumeId；否则用默认；再否则用最新的一份
    let resume = resumes.find((r) => r.id === resumeId);
    if (!resume) {
      resume = resumes.find((r) => r.isDefault === 1) || resumes[0];
    }
    const resumeFull = await this.resumesService.findOne(resume.id);
    if (!resumeFull) {
      return { jobs: [], total: 0 };
    }

    // 拉取所有 OPEN 状态的职位
    const paginationDto = { page: 1, pageSize: 1000, skip: 0 };
    const { list: allOpenJobs, total } = await this.jobsService.findAll(paginationDto as any, {
      status: JobJobStatus.OPEN,
    });

    // 并行算每个职位的匹配详情
    const scoredJobs = await Promise.all(
      allOpenJobs.map(async (job) => {
        const detail = await this._calculateMatchDetail(resumeFull, job);
        return {
          jobId: job.id,
          title: job.title,
          companyId: job.companyId,
          company: (job as any).company?.name || '未知公司',
          location: job.location || '',
          salary:
            job.salaryMin && job.salaryMax
              ? `${job.salaryMin}k-${job.salaryMax}k`
              : '面议',
          matchScore: Number(detail.overallScore.toFixed(1)),
          matchReason: detail.aiReason?.summary || this._buildReasonText(detail),
          ...detail,
        };
      }),
    );

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    return { jobs: scoredJobs.slice(0, limit), total };
  }

  /**
   * 为职位匹配候选人
   */
  async matchCandidates(
    jobId: number,
    companyId: number,
    limit: number = 10,
  ): Promise<{ candidates: any[]; total: number }> {
    const job = await this.jobsService.findOne(jobId);
    if (!job) {
      throw new NotFoundException('职位不存在');
    }
    if (job.companyId !== companyId) {
      throw new ForbiddenException('无权查看其他公司职位的候选人匹配');
    }

    // 拉所有「已解析完成」的简历（含关联候选人）
    const resumesRepo = (this.resumesService as any).resumesRepository as Repository<Resume>;
    const allResumes = (await resumesRepo.find({
      where: { parseStatus: 'completed' as any },
      relations: ['candidate', 'workExperiences', 'educations', 'projects'],
    })) as (Resume & { candidate?: Candidate })[];

    const scored = await Promise.all(
      allResumes
        .filter((r) => !!r.candidate)
        .map(async (resume) => {
          const detail = await this._calculateMatchDetail(resume, job);
          return {
            candidateId: resume.candidateId,
            resumeId: resume.id,
            name:
              (resume as any).parsedData?.name ||
              resume.candidate?.name ||
              '匿名求职者',
            matchScore: Number(detail.overallScore.toFixed(1)),
            matchReason: detail.aiReason?.summary || this._buildReasonText(detail),
            ...detail,
          };
        }),
    );

    scored.sort((a, b) => b.matchScore - a.matchScore);
    return { candidates: scored.slice(0, limit), total: scored.length };
  }

  /**
   * 获取匹配详情
   */
  async getMatchDetail(resumeId: number, jobId: number): Promise<{
    overallScore: number;
    skillMatch: number;
    experienceMatch: number;
    educationMatch: number;
    locationMatch: number;
    salaryMatch: number;
    vectorMatch: number;
    details: Record<string, any>;
    aiReason?: any;
  }> {
    const resume = await this.resumesService.findOne(resumeId);
    const job = await this.jobsService.findOne(jobId);
    if (!resume) {
      throw new NotFoundException('简历不存在');
    }
    if (!job) {
      throw new NotFoundException('职位不存在');
    }
    return this._calculateMatchDetail(resume, job);
  }

  /**
   * 计算简历与职位的匹配分数
   */
  async calculateMatchScore(resumeId: number, jobId: number): Promise<number> {
    const detail = await this.getMatchDetail(resumeId, jobId);
    return Number(detail.overallScore.toFixed(1));
  }

  // -------------------------------------------------------------------------
  // 内部核心：六维匹配算法
  // -------------------------------------------------------------------------

  private async _calculateMatchDetail(resume: Resume, job: Job) {
    // --- 提前准备数据 ---
    const resumeSkills: string[] = Array.isArray(resume.skills)
      ? resume.skills.map((s) => String(s).toLowerCase())
      : [];
    const jobReqSkills: string[] = Array.isArray(job.requiredSkills)
      ? job.requiredSkills.map((s) => String(s).toLowerCase())
      : [];
    const jobPrefSkills: string[] = Array.isArray(job.preferredSkills)
      ? job.preferredSkills.map((s) => String(s).toLowerCase())
      : [];

    const candidate =
      (resume as any).candidate ||
      (await this.candidatesRepository.findOne({
        where: { id: resume.candidateId },
      }));

    // ========== 1. 技能匹配（0-100） ==========
    let skillMatch = 0;
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];
    if (jobReqSkills.length === 0 && jobPrefSkills.length === 0) {
      skillMatch = 60; // 职位没写技能，给中等基础分
    } else {
      jobReqSkills.forEach((s) => {
        if (resumeSkills.includes(s)) matchedSkills.push(s);
        else missingSkills.push(s);
      });
      const requiredScore =
        jobReqSkills.length > 0 ? (matchedSkills.length / jobReqSkills.length) * 100 : 100;
      let preferredHits = 0;
      jobPrefSkills.forEach((s) => {
        if (resumeSkills.includes(s)) preferredHits++;
      });
      const preferredBonus =
        jobPrefSkills.length > 0 ? (preferredHits / jobPrefSkills.length) * 20 : 0;
      skillMatch = Math.min(100, requiredScore * 0.8 + preferredBonus);
    }

    // ========== 2. 经验匹配（0-100） ==========
    let experienceMatch = 50;
    let experienceComment = '未提供经验要求';
    const workYears = Number(candidate?.workYears || 0);
    if (job.experienceMin != null || job.experienceMax != null) {
      const min = Number(job.experienceMin) || 0;
      const max = Number(job.experienceMax) || 99;
      if (workYears >= min && workYears <= max) {
        experienceMatch = 100;
        experienceComment = `工作经验(${workYears}年)完全符合要求(${min}-${max}年)`;
      } else if (workYears < min) {
        const diff = min - workYears;
        experienceMatch = Math.max(20, 100 - diff * 20);
        experienceComment = `经验略低(${workYears}年)，要求${min}-${max}年`;
      } else {
        const diff = workYears - max;
        experienceMatch = Math.max(60, 100 - diff * 10);
        experienceComment = `经验丰富(${workYears}年)，超过上限${max}年`;
      }
    } else if (workYears > 0) {
      experienceMatch = 80;
      experienceComment = `拥有${workYears}年工作经验`;
    }

    // ========== 3. 学历匹配（0-100） ==========
    let educationMatch = 50;
    let educationComment = '未提供学历要求';
    const resumeMaxEdu = candidate?.highestEducation
      ? EDU_ORDER.indexOf(candidate.highestEducation)
      : -1;
    const jobReqEdu = job.educationRequirement
      ? EDU_ORDER.indexOf(job.educationRequirement)
      : -1;
    if (jobReqEdu >= 0) {
      if (resumeMaxEdu >= jobReqEdu) {
        educationMatch = 100;
        educationComment = '学历达标或超出';
      } else {
        const diff = jobReqEdu - resumeMaxEdu;
        educationMatch = Math.max(20, 100 - diff * 30);
        educationComment = `学历略低于要求(差${diff}档)`;
      }
    } else if (resumeMaxEdu >= 0) {
      educationMatch = 80;
      educationComment = `最高学历：${candidate?.highestEducation}`;
    }

    // ========== 4. 地点匹配（0-100） ==========
    let locationMatch = 50;
    let locationComment = '未提供工作地点';
    const jobLoc = (job.location || '').trim();
    const candLoc = (candidate?.expectedCity || candidate?.location || '').trim();
    if (jobLoc && candLoc) {
      if (jobLoc === candLoc || jobLoc.includes(candLoc) || candLoc.includes(jobLoc)) {
        locationMatch = 100;
        locationComment = `工作地点(${jobLoc})与期望地点完全匹配`;
      } else {
        // 只算省级 / 市级前缀（如 "北京市朝阳区" vs "北京市海淀区" => 80）
        const commonPrefix = this._longestCommonPrefix(jobLoc, candLoc);
        if (commonPrefix.length >= 2) {
          locationMatch = 80;
          locationComment = `同属${commonPrefix}，地点较匹配`;
        } else {
          locationMatch = 30;
          locationComment = `地点不匹配(职位：${jobLoc}，期望：${candLoc})`;
        }
      }
    } else if (jobLoc) {
      locationMatch = 70;
      locationComment = `职位地点：${jobLoc}`;
    }

    // ========== 5. 薪资匹配（0-100） ==========
    let salaryMatch = 50;
    let salaryComment = '薪资面议或未提供期望';
    if (job.salaryMin && job.salaryMax) {
      const min = Number(job.salaryMin);
      const max = Number(job.salaryMax);
      const candMin = Number(candidate?.expectedSalaryMin) || min;
      const candMax = Number(candidate?.expectedSalaryMax) || max * 1.5;
      const overlapStart = Math.max(min, candMin);
      const overlapEnd = Math.min(max, candMax);
      if (overlapStart <= overlapEnd) {
        const overlapRatio =
          (overlapEnd - overlapStart) /
          Math.max(1, Math.min(max - min, candMax - candMin));
        salaryMatch = Math.min(100, 60 + overlapRatio * 40);
        salaryComment = `薪资期望在职位范围内(${min}k-${max}k)`;
      } else if (candMin > max) {
        salaryMatch = 30;
        salaryComment = `期望薪资最低(${candMin}k)高于职位上限(${max}k)`;
      } else {
        salaryMatch = 70;
        salaryComment = `期望薪资低于职位范围，可接受`;
      }
    } else if (candidate?.expectedSalaryMin || candidate?.expectedSalaryMax) {
      salaryMatch = 70;
      salaryComment = `期望薪资：${candidate.expectedSalaryMin || 0}k-${candidate.expectedSalaryMax || '∞'}k`;
    }

    // ========== 6. 向量语义相似度（0-100，当前未接 Embedding 时默认 60 基准） ==========
    let vectorMatch = 60;
    try {
      const rv = resume.resumeVector ? JSON.parse(resume.resumeVector) : null;
      const jv = job.jobVector ? JSON.parse(job.jobVector) : null;
      if (rv && jv && Array.isArray(rv) && Array.isArray(jv) && rv.length === jv.length) {
        const sim = this.aiService.cosineSimilarity(rv, jv);
        vectorMatch = Math.max(0, Math.min(100, sim * 100));
      }
    } catch (_) {
      // 向量解析失败走默认
    }

    // ========== 综合加权分数 ==========
    const overallScore = Math.min(
      100,
      skillMatch * MATCH_WEIGHTS.skill +
        experienceMatch * MATCH_WEIGHTS.experience +
        educationMatch * MATCH_WEIGHTS.education +
        locationMatch * MATCH_WEIGHTS.location +
        salaryMatch * MATCH_WEIGHTS.salary +
        vectorMatch * MATCH_WEIGHTS.vector,
    );

    // ========== AI 生成匹配理由（LLM Key 到位后返回真实文案） ==========
    let aiReason: any = null;
    try {
      aiReason = await this.aiService.generateMatchReason(
        resume as any,
        job as any,
        overallScore,
      );
    } catch (_) {
      aiReason = null;
    }

    return {
      overallScore,
      skillMatch: Math.round(skillMatch),
      experienceMatch: Math.round(experienceMatch),
      educationMatch: Math.round(educationMatch),
      locationMatch: Math.round(locationMatch),
      salaryMatch: Math.round(salaryMatch),
      vectorMatch: Math.round(vectorMatch),
      details: {
        matchedSkills,
        missingSkills,
        experienceComment,
        educationComment,
        locationComment,
        salaryComment,
        weights: MATCH_WEIGHTS,
      },
      aiReason,
    };
  }

  // -------------------------------------------------------------------------
  // 辅助函数
  // -------------------------------------------------------------------------

  private _buildReasonText(d: ReturnType<typeof this._calculateMatchDetail> extends Promise<infer R> ? R : never): string {
    const parts: string[] = [];
    if (d.skillMatch >= 80) parts.push('技能匹配度高');
    else if (d.skillMatch >= 60) parts.push('部分技能匹配');
    else parts.push('技能缺口较大');
    if (d.experienceMatch >= 80) parts.push('经验符合要求');
    if (d.educationMatch >= 80) parts.push('学历达标');
    if (d.locationMatch >= 90) parts.push('地点完全匹配');
    if (d.salaryMatch >= 80) parts.push('薪资匹配');
    return parts.join('；') || '暂无亮点';
  }

  private _longestCommonPrefix(a: string, b: string): string {
    let i = 0;
    while (i < a.length && i < b.length && a.charAt(i) === b.charAt(i)) i++;
    return a.substring(0, i);
  }
}
