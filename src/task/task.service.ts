import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { ResponseHandler } from 'src/utils/response-handler';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(data: CreateTaskDto) {
    const { title } = data;

    const hasTask = await this.taskRepository.findOneBy({ title });

    if (hasTask) {
      ResponseHandler.conflict(`${title} already exists`);
    }

    await this.taskRepository.save({ title });

    ResponseHandler.ok(`${title} has successfully created`);
  }

  async findAll() {
    return `This action returns all task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }
}
