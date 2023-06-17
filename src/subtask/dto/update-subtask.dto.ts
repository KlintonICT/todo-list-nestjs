import { IsNotEmpty, IsEnum } from 'class-validator';

import { STATUS } from 'src/utils/constant';

export class UpdateSubtaskDto {
  @IsNotEmpty()
  @IsEnum(STATUS, {
    message:
      'Invalid status. STATUS should be either "pending" or "completed".',
  })
  status: STATUS;
}
