import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Resume } from './resume.entity';

@Entity('projects')
export class Project extends BaseEntity {
  @ApiProperty({ description: '简历ID' })
  @Column({ name: 'resume_id', type: 'int', unsigned: true })
  resumeId: number;

  @ApiProperty({ description: '项目名称' })
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiProperty({ description: '担任角色' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  role: string | null;

  @ApiProperty({ description: '开始时间' })
  @Column({ name: 'start_date', type: 'date', nullable: true })
  startDate: Date | null;

  @ApiProperty({ description: '结束时间' })
  @Column({ name: 'end_date', type: 'date', nullable: true })
  endDate: Date | null;

  @ApiProperty({ description: '项目描述' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: '技术栈' })
  @Column({ name: 'tech_stack', type: 'json', nullable: true })
  techStack: string[] | null;

  @ApiProperty({ description: '排序' })
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Resume, (resume) => resume.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resume_id' })
  resume: Resume;
}
