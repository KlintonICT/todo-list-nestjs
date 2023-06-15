import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { SubtaskService } from './subtask.service';
import { CreateSubtaskDto } from './dto/create-subtask.dto';
import { UpdateSubtaskDto } from './dto/update-subtask.dto';

@Controller('subtasks')
export class SubtaskController {
  constructor(private readonly subtaskService: SubtaskService) {}

  @Post()
  create(@Body() createSubtaskDto: CreateSubtaskDto) {
    return this.subtaskService.create(createSubtaskDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubtaskDto: UpdateSubtaskDto) {
    return this.subtaskService.update(+id, updateSubtaskDto);
  }
}
