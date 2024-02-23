import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class CustomLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  statusCode: number;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  exceptionName: string;

  @Column({ nullable: true })
  stack: string;

  @CreateDateColumn()
  timestamp: Date;
}
