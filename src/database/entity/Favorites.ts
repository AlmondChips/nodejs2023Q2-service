import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  EntityRepository,
  Repository,
} from 'typeorm';
import { Track } from './Track';
import { Artist } from './Artist';
import { Album } from './Album';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Track, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  tracks: Track[];

  @ManyToMany(() => Album, { onDelete: 'CASCADE', eager: true })
  @JoinTable()
  albums: Album[];
}
