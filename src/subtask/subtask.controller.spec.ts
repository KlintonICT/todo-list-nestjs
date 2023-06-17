import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SubtaskController } from './subtask.controller';
import { SubtaskService } from './subtask.service';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';
import { STATUS } from 'src/utils/constant';

describe('SubtaskController', () => {
  let controller: SubtaskController;
  let service: SubtaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtaskController],
      providers: [
        SubtaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Subtask),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SubtaskController>(SubtaskController);
    service = module.get<SubtaskService>(SubtaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('"create" should call create service function', async () => {
    const body = { todo_id: 1, title: 'Subtask1' };
    jest.spyOn(service, 'create');

    try {
      await controller.create(body);
    } catch (error) {
      expect(service.create).toBeCalledWith(body);
    }
  });

  it('"update" should call "update" service function', async () => {
    const [id, status] = ['1', STATUS.COMPLETED];

    jest.spyOn(service, 'update');

    try {
      await controller.update(id, { status });
    } catch (error) {
      expect(service.update).toBeCalledWith(+id, { status });
    }
  });
});
