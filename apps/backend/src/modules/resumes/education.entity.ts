import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Resume } from './resume.entity';

@Entity('educations')
export class Education extends BaseEntity {
  @ApiProperty({ description: '简历ID' })
  @Column({ name: 'resume_id', type: 'int', unsigned: true })
  resumeId: number;

  @ApiProperty({ description: '学校名称' })
  @Column({ name: 'school_name', type: 'varchar', length: 200 })
  schoolName: string;

  @ApiProperty({ description: '学位' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  degree: string | null;

  @ApiProperty({ description: '专业' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  major: string | null;

  @ApiProperty({ description: '开始时间' })
  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @ApiProperty({ description: '结束时间' })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @ApiProperty({ description: '描述' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: 'GPA' })
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  gpa: number | null;

  @ApiProperty({ description: '排序' })
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.educations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: Resume;
}
