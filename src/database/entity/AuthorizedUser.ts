import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { Track } from './Track';
import { Artist } from './Artist';
import { Album } from './Album';
import { User } from './User';

@Entity()
export class AuthorizedUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  refreshToken: string;

  @Column()
  accessToken: string;

  @Column({ type: 'bigint', width: 200 })
  expiresAt: number;

  @Column({ type: 'bigint', width: 200 })
  refreshExpiresAt: number;

  @OneToOne(() => User, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
