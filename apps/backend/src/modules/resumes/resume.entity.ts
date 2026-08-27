import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Candidate } from '../candidates/candidate.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
import { Project } from './project.entity';

export enum ParseStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity('resumes')
export class Resume extends BaseEntity {
  @ApiProperty({ description: '候选人ID' })
  @Column({ name: 'candidate_id', type: 'int', unsigned: true })
  candidateId: number;

  @ApiProperty({ description: '简历标题' })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({ description: '文件名' })
  @Column({ name: 'file_name', type: 'varchar', length: 255 })
  fileName: string;

  @ApiProperty({ description: '文件路径' })
  @Column({ name: 'file_path', type: 'varchar', length: 500 })
  filePath: string;

  @ApiProperty({ description: '文件大小（字节）' })
  @Column({ name: 'file_size', type: 'int', nullable: true })
  fileSize: number | null;

  @ApiProperty({ description: '文件类型' })
  @Column({ name: 'file_type', type: 'varchar', length: 50, nullable: true })
  fileType: string | null;

  @ApiProperty({ description: '解析状态', enum: ParseStatus })
  @Column({
    name: 'parse_status',
    type: 'enum',
    enum: ParseStatus,
    default: ParseStatus.PENDING,
  })
  parseStatus: ParseStatus;

  @ApiProperty({ description: '解析置信度' })
  @Column({
    name: 'parse_confidence',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  parseConfidence: number | null;

  @ApiProperty({ description: '是否为默认简历' })
  @Column({ name: 'is_default', type: 'tinyint', default: 0 })
  isDefault: number;

  @ApiProperty({ description: '解析后的数据' })
  @Column({ name: 'parsed_data', type: 'json', nullable: true })
  parsedData: Record<string, any> | null;

  @ApiProperty({ description: '技能列表' })
  @Column({ type: 'json', nullable: true })
  skills: string[] | null;

  @ApiProperty({ description: '简历向量' })
  @Column({ name: 'resume_vector', type: 'text', nullable: true })
  resumeVector: string | null;

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Candidate;

  @OneToMany(() => WorkExperience, (workExperience) => workExperience.resume)
  workExperiences: WorkExperience[];

  @OneToMany(() => Education, (education) => education.resume)
  educations: Education[];

  @OneToMany(() => Project, (project) => project.resume)
  projects: Project[];
}
