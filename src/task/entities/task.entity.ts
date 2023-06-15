import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

import { Subtask } from 'src/subtask/entities/subtask.entity';

export enum Status {
  COMPLETED = 'completed',
  PENDING = 'pending',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255, unique: true })
  title: string;

  @Column({
    type: 'enum',
    nullable: false,
    enum: Status,
    default: Status.PENDING,
  })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Subtask, (subtask) => subtask.todo_id)
  subtasks: Subtask[];
}
