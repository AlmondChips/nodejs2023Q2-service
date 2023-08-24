import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Track } from './Track';
import { Artist } from './Artist';
import { Album } from './Album';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: true,
  })
  @JoinTable()
  artists: Artist[];

  @ManyToMany(() => Track, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinTable()
  tracks: Track[];

  @ManyToMany(() => Album, { onDelete: 'CASCADE', eager: true, nullable: true })
  @JoinTable()
  albums: Album[];
}
