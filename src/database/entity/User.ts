import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password?: string;

  @Column()
  version: number; // integer number, increments on update

  @Column({ type: 'bigint', width: 200 })
  createdAt: number; // timestamp of creation

  @Column({ type: 'bigint', width: 200 })
  updatedAt: number; // timestamp of last update
}
