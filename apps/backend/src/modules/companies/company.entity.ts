import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/user.entity';
import { Job } from '../jobs/job.entity';

@Entity('companies')
export class Company extends BaseEntity {
  @ApiProperty({ description: '用户ID' })
  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @ApiProperty({ description: '公司名称' })
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiProperty({ description: '公司Logo' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  logo: string | null;

  @ApiProperty({ description: '所属行业' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  industry: string | null;

  @ApiProperty({ description: '公司规模' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  size: string | null;

  @ApiProperty({ description: '公司网站' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @ApiProperty({ description: '公司描述' })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ description: '公司地址' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @ApiProperty({ description: '是否已认证' })
  @Column({ type: 'tinyint', default: 0 })
  verified: number;

  @ApiProperty({ description: '认证时间' })
  @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
  verifiedAt: Date | null;

  @ManyToOne(() => User, (user) => user.company)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Job, (job) => job.company)
  jobs: Job[];
}
