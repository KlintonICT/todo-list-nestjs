import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { Subtask } from 'src/subtask/entities/subtask.entity';

const mockTaskRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
};

const mockSubtaskRepository = {
  update: jest.fn(),
};

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
        {
          provide: getRepositoryToken(Subtask),
          useValue: mockSubtaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created todo when success', async () => {
      const mockData = { title: 'Todo1' };
      const savedTodo = {
        id: 1,
        title: 'Todo1',
        status: 'pending',
        created_at: '2023-06-16 09:43:22.444',
      };

      mockTaskRepository.findOneBy.mockResolvedValue(undefined);
      mockTaskRepository.save.mockResolvedValue(savedTodo);

      const result = await service.create(mockData);

      expect(result).toStrictEqual({
        message: `${mockData.title} has successfully created`,
        data: {
          ...savedTodo,
          subtasks: [],
        },
      });
      expect(mockTaskRepository.findOneBy).toBeCalledWith(mockData);
      expect(mockTaskRepository.save).toBeCalledWith(mockData);
    });

    it('should throw "title already exists" when title is already created', async () => {
      const mockData = { title: 'Todo1' };
      const foundTodo = {
        id: 1,
        title: 'Todo1',
        status: 'pending',
        created_at: '2023-06-16 09:43:22.444',
      };

      mockTaskRepository.findOneBy.mockResolvedValue(foundTodo);

      try {
        await service.create(mockData);
      } catch (error) {
        expect(error?.message).toEqual(`${mockData.title} already exists`);
      }
    });
  });
});
