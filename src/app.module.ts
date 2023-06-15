import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { SubtaskModule } from './subtask/subtask.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cs: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        host: cs.get('POSTGRES_HOST'),
        port: +cs.get('POSTGRES_PORT'),
        username: cs.get('POSTGRES_USER'),
        password: cs.get('POSTGRES_PASSWORD'),
        database: cs.get('POSTGRES_DB'),
      }),
    }),
    TaskModule,
    SubtaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
