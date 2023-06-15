import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { Task } from './entities/task.entity';
import { Subtask } from 'src/subtask/entities/subtask.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask])],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
