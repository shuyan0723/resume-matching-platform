import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './candidate.entity';
import { CandidatesService } from './candidates.service';
import { CandidatesController } from './candidates.controller';

/**
 * 候选人模块
 * 负责管理求职者的个人资料、求职意向等信息
 */
@Module({
  imports: [TypeOrmModule.forFeature([Candidate])],
  providers: [CandidatesService],
  controllers: [CandidatesController],
  exports: [CandidatesService],
})
export class CandidatesModule {}
