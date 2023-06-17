import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Task } from 'src/task/entities/task.entity';
import { STATUS } from 'src/utils/constant';

@Entity()
export class Subtask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  title: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: STATUS,
    default: STATUS.PENDING,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Task, (task) => task.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'todo_id' })
  todo_id: Task;
}
