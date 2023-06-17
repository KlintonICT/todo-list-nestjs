import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { Subtask } from 'src/subtask/entities/subtask.entity';
import { ResponseHandler } from 'src/utils/response-handler';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private readonly subtaskRepository: Repository<Subtask>,
  ) {}

  async create(data: CreateTaskDto) {
    const { title } = data;

    const hasTask = await this.taskRepository.findOneBy({ title });

    if (hasTask) {
      ResponseHandler.conflict(`${title} already exists`);
    }

    const task = await this.taskRepository.save({ title });

    return {
      message: `${title} has successfully created`,
      data: { ...task, subtasks: [] },
    };
  }

  async findAll() {
    const tasks = await this.taskRepository.find({
      relations: ['subtasks'],
      order: {
        created_at: 'ASC',
        subtasks: {
          created_at: 'ASC',
        },
      },
    });

    ResponseHandler.ok(tasks);
  }

  async update(id: number, data: UpdateTaskDto) {
    const { status } = data;

    const hasTask = await this.taskRepository.findOneBy({ id });

    if (!hasTask) {
      ResponseHandler.notFound(`${id} not found`);
    }

    await Promise.all([
      this.taskRepository.update(id, { status }),
      this.subtaskRepository.update({ todo_id: { id } }, { status }),
    ]);

    ResponseHandler.ok(`todo ${id} has successfully updated`);
  }
}
