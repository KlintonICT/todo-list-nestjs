import { IsNotEmpty, IsEnum } from 'class-validator';

import { Status } from 'src/utils/constant';

export class UpdateSubtaskDto {
  @IsNotEmpty()
  @IsEnum(Status, {
    message:
      'Invalid status. Status should be either "pending" or "completed".',
  })
  status: Status;
}
