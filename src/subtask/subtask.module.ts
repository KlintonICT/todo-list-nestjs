import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubtaskService } from './subtask.service';
import { SubtaskController } from './subtask.controller';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask])],
  controllers: [SubtaskController],
  providers: [SubtaskService],
})
export class SubtaskModule {}
