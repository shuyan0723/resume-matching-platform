import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumesModule } from '../resumes/resumes.module';
import { JobsModule } from '../jobs/jobs.module';
import { AiModule } from '../ai/ai.module';
import { Candidate } from '../candidates/candidate.entity';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';

/**
 * 匹配模块
 * 负责简历与职位的智能匹配、推荐等功能
 * 注入 ResumesService 和 JobsService 以获取简历和职位数据
 */
@Module({
  imports: [
    ResumesModule,
    JobsModule,
    AiModule,
    TypeOrmModule.forFeature([Candidate]),
  ],
  providers: [MatchingService],
  controllers: [MatchingController],
  exports: [MatchingService],
})
export class MatchingModule {}
