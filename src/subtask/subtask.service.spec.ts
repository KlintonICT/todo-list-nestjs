import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubtaskService } from './subtask.service';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';

describe('SubtaskService', () => {
  let service: SubtaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SubtaskService>(SubtaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
