import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSubtaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  todo_id: number;
}
