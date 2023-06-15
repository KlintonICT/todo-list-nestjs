import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';
import { ResponseHandler } from 'src/utils/response-handler';
import { Status } from 'src/utils/constant';

@Injectable()
export class SubtaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private readonly subtaskRepository: Repository<Subtask>,
  ) {}

  async create(data: CreateSubtaskDto) {
    const { todo_id, title } = data;

    const task = await this.taskRepository.findOneBy({ id: todo_id });

    if (!task) {
      ResponseHandler.notFound(`${todo_id} has not found`);
    }

    const hasSubtask = await this.subtaskRepository.findOne({
      where: { title, todo_id: { id: todo_id } },
    });

    if (hasSubtask) {
      ResponseHandler.conflict(`${title} already exists`);
    }

    await Promise.all([
      this.taskRepository.update(todo_id, { status: Status.PENDING }),
      this.subtaskRepository.save({ title, todo_id: task }),
    ]);

    ResponseHandler.ok(`${title} has successfully created`);
  }

  update(id: number, updateSubtaskDto: UpdateSubtaskDto) {
    return `This action updates a #${id} subtask`;
  }
}
