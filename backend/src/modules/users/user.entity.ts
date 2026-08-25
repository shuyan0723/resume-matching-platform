import { Entity, Column, Index, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { Candidate } from '../candidates/candidate.entity';
import { Company } from '../companies/company.entity';

export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
}

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ description: '邮箱' })
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({ description: '昵称' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string | null;

  @ApiProperty({ description: '头像URL' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @ApiProperty({ description: '用户角色', enum: UserRole })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CANDIDATE,
  })
  @Index()
  role: UserRole;

  @ApiProperty({ description: '手机号' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @ApiProperty({ description: '状态', enum: UserStatus })
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  @Index()
  status: UserStatus;

  @ApiProperty({ description: '邮箱验证时间' })
  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @ApiProperty({ description: '最后登录时间' })
  @Column({ name: 'last_login_at', type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  @OneToOne(() => Candidate, (candidate) => candidate.user)
  candidate: Candidate;

  @OneToOne(() => Company, (company) => company.user)
  company: Company;
}
