import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';

describe('SubtaskController', () => {
  let controller: SubtaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtaskController],
      providers: [
        SubtaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: Repository<Task>,
        },
        {
          provide: getRepositoryToken(Subtask),
          useValue: Repository<Subtask>,
        },
      ],
    }).compile();

    controller = module.get<SubtaskController>(SubtaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
