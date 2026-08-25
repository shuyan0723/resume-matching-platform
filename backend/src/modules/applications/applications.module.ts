import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';

/**
 * 求职申请模块
 * 负责管理求职者的职位申请记录、状态流转等
 */
@Module({
  imports: [TypeOrmModule.forFeature([Application])],
  providers: [ApplicationsService],
  controllers: [ApplicationsController],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
