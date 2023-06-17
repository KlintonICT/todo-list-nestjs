import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

import { SubtaskService } from './subtask.service';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';
import { STATUS } from 'src/utils/constant';

const mockTaskRepository = {
  findOneBy: jest.fn(),
  update: jest.fn(),
};

const mockSubtaskRepository = {
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  update: jest.fn(),
};

describe('SubtaskService', () => {
  let service: SubtaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubtaskService,
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

    service = module.get<SubtaskService>(SubtaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return created subtask', async () => {
      const mockData = { todo_id: 1, title: 'Subtask1' };
      const savedSubtask = {
        id: 1,
        title: 'Subtask1',
        status: 'pending',
        create_at: new Date(),
      };
      const foundTask = {
        id: 1,
        title: 'todo1',
        status: 'pending',
        create_at: new Date(),
      };

      mockTaskRepository.findOneBy.mockResolvedValue(foundTask);
      mockSubtaskRepository.findOne.mockResolvedValue(undefined);
      mockSubtaskRepository.save.mockResolvedValue(savedSubtask);

      const result = await service.create(mockData);

      expect(result).toStrictEqual({
        message: `${mockData.title} has successfully created`,
        data: savedSubtask,
      });
      expect(mockTaskRepository.findOneBy).toBeCalledWith({
        id: mockData.todo_id,
      });
      expect(mockSubtaskRepository.findOne).toBeCalledWith({
        where: { title: mockData.title, todo_id: { id: mockData.todo_id } },
      });
      expect(mockSubtaskRepository.save).toBeCalledWith({
        title: mockData.title,
        todo_id: foundTask,
      });
      expect(mockTaskRepository.update).toBeCalledWith(mockData.todo_id, {
        status: STATUS.PENDING,
      });
    });

    it('should throw "todo 999 has not found" when send todo id=999 that is not in DB', async () => {
      const mockData = { todo_id: 999, title: 'Subtask1' };

      mockTaskRepository.findOneBy.mockResolvedValue(undefined);

      try {
        await service.create(mockData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('todo 999 has not found');
        expect(mockTaskRepository.findOneBy).toBeCalledWith({
          id: mockData.todo_id,
        });
      }
    });

    it('should throw "Subtask1 already exists" when the Subtask1 already has in DB', async () => {
      const mockData = { todo_id: 1, title: 'Subtask1' };
      const foundSubtask = {
        id: 1,
        title: 'Subtask1',
        status: 'pending',
        create_at: new Date(),
      };
      const foundTask = {
        id: 1,
        title: 'todo1',
        status: 'pending',
        create_at: new Date(),
      };
      mockTaskRepository.findOneBy.mockResolvedValue(foundTask);
      mockSubtaskRepository.findOne.mockResolvedValue(foundSubtask);

      try {
        await service.create(mockData);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Subtask1 already exists');
        expect(mockTaskRepository.findOneBy).toBeCalledWith({
          id: mockData.todo_id,
        });
        expect(mockSubtaskRepository.findOne).toBeCalledWith({
          where: { title: mockData.title, todo_id: { id: mockData.todo_id } },
        });
      }
    });
  });

  describe('update', () => {
    it('should return successfully updated response when update success', async () => {
      const [id, status] = [1, STATUS.COMPLETED];
      const subtask = {
        id: 1,
        title: 'Subtask1',
        status: 'pending',
        create_at: new Date(),
      };
      const foundSubtaskWithTodoRelation = {
        ...subtask,
        todo_id: {
          id: 1,
          title: 'todo1',
          status: 'pending',
          create_at: new Date(),
        },
      };
      const foundAllSubtasks = [subtask];

      mockSubtaskRepository.findOne.mockResolvedValue(
        foundSubtaskWithTodoRelation,
      );
      mockSubtaskRepository.find.mockResolvedValue(foundAllSubtasks);
      jest.spyOn(foundAllSubtasks, 'every').mockImplementation(() => true);

      const result = await service.update(id, { status });

      expect(result).toStrictEqual({
        message: `subtask ${id} has successfully updated`,
        todo_id: foundSubtaskWithTodoRelation.todo_id.id,
        todoStatus: STATUS.COMPLETED,
      });
      expect(mockSubtaskRepository.findOne).toBeCalledWith({
        where: { id },
        relations: ['todo_id'],
      });
      expect(mockSubtaskRepository.update).toBeCalledWith(id, { status });
      expect(mockSubtaskRepository.find).toBeCalledWith({
        where: { todo_id: { id: foundSubtaskWithTodoRelation.todo_id.id } },
      });
      expect(
        foundAllSubtasks.every(
          (subtask) => subtask.status === STATUS.COMPLETED,
        ),
      ).toBe(true);
      expect(mockTaskRepository.update).toBeCalledWith(
        foundSubtaskWithTodoRelation.todo_id.id,
        { status: STATUS.COMPLETED },
      );
    });

    it('should return "todoStatus=pending" when update subtask to pending', async () => {
      const [id, status] = [1, STATUS.PENDING];
      const subtask = {
        id: 1,
        title: 'Subtask1',
        status: 'completed',
        create_at: new Date(),
      };
      const foundSubtaskWithTodoRelation = {
        ...subtask,
        todo_id: {
          id: 1,
          title: 'todo1',
          status: 'pending',
          create_at: new Date(),
        },
      };
      const foundAllSubtasks = [subtask];

      mockSubtaskRepository.findOne.mockResolvedValue(
        foundSubtaskWithTodoRelation,
      );
      mockSubtaskRepository.find.mockResolvedValue(foundAllSubtasks);
      jest.spyOn(foundAllSubtasks, 'every').mockImplementation(() => false);

      const result = await service.update(id, { status });

      expect(result).toStrictEqual({
        message: `subtask ${id} has successfully updated`,
        todo_id: foundSubtaskWithTodoRelation.todo_id.id,
        todoStatus: STATUS.PENDING,
      });
    });

    it('should throw "999 has not found" when send subtask id=999 that is not in DB', async () => {
      const [id, status] = [999, STATUS.COMPLETED];

      mockSubtaskRepository.findOne.mockResolvedValue(undefined);

      try {
        await service.update(id, { status });
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toStrictEqual('999 has not found');
        expect(mockSubtaskRepository.findOne).toBeCalledWith({
          where: { id },
          relations: ['todo_id'],
        });
      }
    });
  });
});
