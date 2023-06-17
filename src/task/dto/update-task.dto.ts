import { IsNotEmpty, IsEnum } from 'class-validator';

import { STATUS } from 'src/utils/constant';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsEnum(STATUS, {
    message:
      'Invalid status. STATUS should be either "pending" or "completed".',
  })
  status: STATUS;
}
