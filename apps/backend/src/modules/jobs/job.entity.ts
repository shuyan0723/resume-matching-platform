import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../companies/company.entity';

export enum EducationRequirement {
  HIGH_SCHOOL = 'high_school',
  COLLEGE = 'college',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  INTERNSHIP = 'internship',
  REMOTE = 'remote',
}

export enum JobStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  PAUSED = 'paused',
  CLOSED = 'closed',
}

@Entity('jobs')
export class Job extends BaseEntity {
  @ApiProperty({ description: '公司ID' })
  @Column({ name: 'company_id', type: 'int', unsigned: true })
  companyId: number;

  @ApiProperty({ description: '职位名称' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: '所属部门' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  @ApiProperty({ description: '工作地点' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @ApiProperty({ description: '最低薪资' })
  @Column({ name: 'salary_min', type: 'int', nullable: true })
  salaryMin: number | null;

  @ApiProperty({ description: '最高薪资' })
  @Column({ name: 'salary_max', type: 'int', nullable: true })
  salaryMax: number | null;

  @ApiProperty({ description: '最低工作经验要求（年）' })
  @Column({
    name: 'experience_min',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  experienceMin: number | null;

  @ApiProperty({ description: '最高工作经验要求（年）' })
  @Column({
    name: 'experience_max',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  experienceMax: number | null;

  @ApiProperty({ description: '学历要求', enum: EducationRequirement })
  @Column({
    name: 'education_requirement',
    type: 'enum',
    enum: EducationRequirement,
    nullable: true,
  })
  educationRequirement: EducationRequirement | null;

  @ApiProperty({ description: '工作类型', enum: JobType })
  @Column({
    name: 'job_type',
    type: 'enum',
    enum: JobType,
    nullable: true,
  })
  jobType: JobType | null;

  @ApiProperty({ description: '职位描述' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: '职位要求' })
  @Column({ type: 'json', nullable: true })
  requirements: Record<string, any> | null;

  @ApiProperty({ description: '必备技能' })
  @Column({ name: 'required_skills', type: 'json', nullable: true })
  requiredSkills: string[] | null;

  @ApiProperty({ description: '优先技能' })
  @Column({ name: 'preferred_skills', type: 'json', nullable: true })
  preferredSkills: string[] | null;

  @ApiProperty({ description: '职位向量' })
  @Column({ name: 'job_vector', type: 'text', nullable: true })
  jobVector: string | null;

  @ApiProperty({ description: '职位状态', enum: JobStatus })
  @Column({
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.DRAFT,
  })
  status: JobStatus;

  @ApiProperty({ description: '浏览次数' })
  @Column({ name: 'view_count', type: 'int', unsigned: true, default: 0 })
  viewCount: number;

  @ApiProperty({ description: '申请次数' })
  @Column({ name: 'application_count', type: 'int', unsigned: true, default: 0 })
  applicationCount: number;

  @ApiProperty({ description: '是否紧急' })
  @Column({ type: 'tinyint', default: 0 })
  urgent: number;

  @ApiProperty({ description: '发布时间' })
  @Column({ name: 'published_at', type: 'timestamp', nullable: true })
  publishedAt: Date | null;

  @ApiProperty({ description: '关闭时间' })
  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date | null;

  @ManyToOne(() => Company, (company) => company.jobs)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
