import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { Subtask } from 'src/subtask/entities/subtask.entity';
import { Status } from 'src/utils/constant';

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
        created_at: new Date(),
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
        created_at: new Date(),
      };

      mockTaskRepository.findOneBy.mockResolvedValue(foundTodo);

      try {
        await service.create(mockData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error?.message).toStrictEqual(
          `${mockData.title} already exists`,
        );
      }
    });
  });

  describe('findAll', () => {
    it('should return all todos when success', async () => {
      const todoList = [
        {
          id: 1,
          title: 'Todo1',
          status: 'pending',
          created_at: new Date(),
          subtasks: [
            {
              id: 1,
              title: 'Subtask1',
              status: 'pending',
              created_at: new Date(),
            },
          ],
        },
      ];

      mockTaskRepository.find.mockResolvedValue(todoList);

      const result = await service.findAll();

      expect(result).toStrictEqual(todoList);
      expect(mockTaskRepository.find).toBeCalled();
    });

    it('should return [] when there are no todo in DB', async () => {
      mockTaskRepository.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toStrictEqual([]);
      expect(mockTaskRepository.find).toBeCalled();
    });
  });

  describe('update', () => {
    it('should return "todo 1 has successfully updated"', async () => {
      const [id, status] = [1, Status.COMPLETED];
      const foundTodo = {
        id: 1,
        title: 'Todo1',
        status: 'pending',
        created_at: new Date(),
      };

      mockTaskRepository.findOneBy.mockResolvedValue(foundTodo);

      const result = await service.update(id, { status });

      expect(mockTaskRepository.findOneBy).toBeCalledWith({ id });
      expect(mockTaskRepository.update).toBeCalledWith(id, { status });
      expect(mockSubtaskRepository.update).toBeCalledWith(
        { todo_id: { id } },
        { status },
      );
      expect(result).toStrictEqual(`todo ${id} has successfully updated`);
    });

    it('should throw "1 not found"', async () => {
      const [id, status] = [1, Status.COMPLETED];

      mockTaskRepository.findOneBy.mockResolvedValue(undefined);

      try {
        await service.update(id, { status });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toStrictEqual(`${id} not found`);
        expect(mockTaskRepository.findOneBy).toBeCalledWith({ id });
      }
    });
  });
});
