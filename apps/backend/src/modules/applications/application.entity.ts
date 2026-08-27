import { Entity, Column, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Job } from '../jobs/job.entity';
import { Resume } from '../resumes/resume.entity';
import { Candidate } from '../candidates/candidate.entity';
import { Company } from '../companies/company.entity';

export enum ApplicationStatus {
  APPLIED = 'applied',
  VIEWED = 'viewed',
  SHORTLISTED = 'shortlisted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  HIRED = 'hired',
}

@Entity('applications')
@Unique(['jobId', 'resumeId'])
export class Application extends BaseEntity {
  @ApiProperty({ description: '职位ID' })
  @Column({ name: 'job_id', type: 'int', unsigned: true })
  jobId: number;

  @ApiProperty({ description: '简历ID' })
  @Column({ name: 'resume_id', type: 'int', unsigned: true })
  resumeId: number;

  @ApiProperty({ description: '候选人ID' })
  @Column({ name: 'candidate_id', type: 'int', unsigned: true })
  candidateId: number;

  @ApiProperty({ description: '公司ID' })
  @Column({ name: 'company_id', type: 'int', unsigned: true })
  companyId: number;

  @ApiProperty({ description: '匹配分数' })
  @Column({
    name: 'match_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  matchScore: number | null;

  @ApiProperty({ description: '匹配详情' })
  @Column({ name: 'match_detail', type: 'json', nullable: true })
  matchDetail: Record<string, any> | null;

  @ApiProperty({ description: '申请状态', enum: ApplicationStatus })
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.APPLIED,
  })
  status: ApplicationStatus;

  @ApiProperty({ description: '候选人备注' })
  @Column({ name: 'candidate_note', type: 'varchar', length: 500, nullable: true })
  candidateNote: string | null;

  @ApiProperty({ description: '雇主备注' })
  @Column({ name: 'employer_note', type: 'text', nullable: true })
  employerNote: string | null;

  @ApiProperty({ description: '申请时间' })
  @Column({ name: 'applied_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  appliedAt: Date;

  @ApiProperty({ description: '查看时间' })
  @Column({ name: 'viewed_at', type: 'timestamp', nullable: true })
  viewedAt: Date | null;

  @ManyToOne(() => Job)
  @JoinColumn({ name: 'job_id' })
  job: Job;

  @ManyToOne(() => Resume)
  @JoinColumn({ name: 'resume_id' })
  resume: Resume;

  @ManyToOne(() => Candidate)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
