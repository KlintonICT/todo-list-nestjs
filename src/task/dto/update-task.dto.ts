import { IsNotEmpty, IsEnum } from 'class-validator';

import { Status } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(Status, {
    message:
      'Invalid status. Status should be either "pending" or "completed".',
  })
  status: Status;
}
