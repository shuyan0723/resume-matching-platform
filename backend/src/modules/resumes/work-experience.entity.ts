import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Resume } from './resume.entity';

@Entity('work_experiences')
export class WorkExperience extends BaseEntity {
  @ApiProperty({ description: '简历ID' })
  @Column({ name: 'resume_id', type: 'int', unsigned: true })
  resumeId: number;

  @ApiProperty({ description: '公司名称' })
  @Column({ name: 'company_name', type: 'varchar', length: 200 })
  companyName: string;

  @ApiProperty({ description: '职位' })
  @Column({ type: 'varchar', length: 100 })
  position: string;

  @ApiProperty({ description: '开始时间' })
  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @ApiProperty({ description: '结束时间' })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @ApiProperty({ description: '是否在职' })
  @Column({ name: 'is_current', type: 'tinyint', default: 0 })
  isCurrent: number;

  @ApiProperty({ description: '工作描述' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: '使用的技能' })
  @Column({ type: 'json', nullable: true })
  skills: string[] | null;

  @ApiProperty({ description: '排序' })
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.workExperiences, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: Resume;
}
