import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/user.entity';
import { Resume } from '../resumes/resume.entity';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum JobStatus {
  LOOKING = 'looking',
  CONSIDERING = 'considering',
  NOT_LOOKING = 'not_looking',
}

export enum HighestEducation {
  HIGH_SCHOOL = 'high_school',
  COLLEGE = 'college',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  PHD = 'phd',
}

@Entity('candidates')
export class Candidate extends BaseEntity {
  @ApiProperty({ description: '用户ID' })
  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ApiProperty({ description: '姓名' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ description: '性别', enum: Gender })
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender: Gender | null;

  @ApiProperty({ description: '出生日期' })
  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null;

  @ApiProperty({ description: '所在地' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string | null;

  @ApiProperty({ description: '期望职位' })
  @Column({ name: 'expected_position', type: 'varchar', length: 100, nullable: true })
  expectedPosition: string | null;

  @ApiProperty({ description: '期望最低薪资' })
  @Column({ name: 'expected_salary_min', type: 'int', nullable: true })
  expectedSalaryMin: number | null;

  @ApiProperty({ description: '期望最高薪资' })
  @Column({ name: 'expected_salary_max', type: 'int', nullable: true })
  expectedSalaryMax: number | null;

  @ApiProperty({ description: '期望城市' })
  @Column({ name: 'expected_city', type: 'varchar', length: 100, nullable: true })
  expectedCity: string | null;

  @ApiProperty({ description: '求职状态', enum: JobStatus })
  @Column({
    name: 'job_status',
    type: 'enum',
    enum: JobStatus,
    default: JobStatus.LOOKING,
  })
  jobStatus: JobStatus;

  @ApiProperty({ description: '工作年限' })
  @Column({
    name: 'work_years',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  workYears: number | null;

  @ApiProperty({ description: '最高学历', enum: HighestEducation })
  @Column({
    name: 'highest_education',
    type: 'enum',
    enum: HighestEducation,
    nullable: true,
  })
  highestEducation: HighestEducation | null;

  @ManyToOne(() => User, (user) => user.candidate)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Resume, (resume) => resume.candidate)
  resumes: Resume[];
}
