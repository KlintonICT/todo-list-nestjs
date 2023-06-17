import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';
import { Subtask } from './entities/subtask.entity';
import { Task } from 'src/task/entities/task.entity';
import { ResponseHandler } from 'src/utils/response-handler';
import { STATUS } from 'src/utils/constant';

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
      ResponseHandler.notFound(`todo ${todo_id} has not found`);
    }

    const hasSubtask = await this.subtaskRepository.findOne({
      where: { title, todo_id: { id: todo_id } },
    });

    if (hasSubtask) {
      ResponseHandler.conflict(`${title} already exists`);
    }

    const [subtask] = await Promise.all([
      this.subtaskRepository.save({ title, todo_id: task }),
      this.taskRepository.update(todo_id, { status: STATUS.PENDING }),
    ]);

    return {
      message: `${title} has successfully created`,
      data: subtask,
    };
  }

  async update(id: number, data: UpdateSubtaskDto) {
    const { status } = data;

    const subtask = await this.subtaskRepository.findOne({
      where: { id },
      relations: ['todo_id'],
    });

    if (!subtask) {
      ResponseHandler.conflict(`${id} has not found`);
    }

    await this.subtaskRepository.update(id, { status });

    const allSubtasks = await this.subtaskRepository.find({
      where: { todo_id: { id: subtask.todo_id.id } },
    });

    const isTodoCompleted = allSubtasks.every(
      (subtask) => subtask.status === STATUS.COMPLETED,
    );

    await this.taskRepository.update(subtask.todo_id.id, {
      status: isTodoCompleted ? STATUS.COMPLETED : STATUS.PENDING,
    });

    return {
      message: `subtask ${id} has successfully updated`,
      todo_id: subtask.todo_id.id,
      todoStatus: isTodoCompleted ? STATUS.COMPLETED : STATUS.PENDING,
    };
  }
}
