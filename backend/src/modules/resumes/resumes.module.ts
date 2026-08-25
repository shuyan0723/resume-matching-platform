import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Resume } from './resume.entity';
import { WorkExperience } from './work-experience.entity';
import { Education } from './education.entity';
import { Project } from './project.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';

/**
 * 简历模块
 * 负责简历的上传、解析、管理等功能
 * 使用 Bull 队列进行异步简历解析处理
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([Resume, WorkExperience, Education, Project]),
    BullModule.registerQueue({
      name: 'resume-parse',
    }),
  ],
  providers: [ResumesService],
  controllers: [ResumesController],
  exports: [ResumesService],
})
export class ResumesModule {}
