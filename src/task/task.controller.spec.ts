import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { Subtask } from 'src/subtask/entities/subtask.entity';
import { STATUS } from 'src/utils/constant';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Subtask),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('"create" should call create service function', async () => {
    const body = { title: 'Todo1' };
    jest.spyOn(service, 'create');

    await controller.create(body);

    expect(service.create).toBeCalledWith(body);
  });

  it('"findAll" should call "findAll" service function', async () => {
    jest.spyOn(service, 'findAll');

    await controller.findAll();

    expect(service.findAll).toBeCalled();
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
