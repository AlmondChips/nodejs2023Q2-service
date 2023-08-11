import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  password?: string;

  @Column()
  version: number; // integer number, increments on update

  @Column()
  createdAt: number; // timestamp of creation

  @Column()
  updatedAt: number; // timestamp of last update
}
