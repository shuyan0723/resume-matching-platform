import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MatchingModule } from './modules/matching/matching.module';
import { AiModule } from './modules/ai/ai.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { UploadModule } from './modules/upload/upload.module';
import typeOrmConfig from './config/typeorm.config';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 数据库
    TypeOrmModule.forRoot(typeOrmConfig),

    // Redis 队列
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
        retryStrategy: (times: number) => Math.min(times * 500, 2000),
      },
    }),

    // 业务模块
    AuthModule,
    UsersModule,
    ResumesModule,
    JobsModule,
    MatchingModule,
    AiModule,
    CompaniesModule,
    CandidatesModule,
    ApplicationsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
