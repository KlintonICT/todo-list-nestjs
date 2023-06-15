import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @UpdateDateColumn()
  updated_at: Date;
}
