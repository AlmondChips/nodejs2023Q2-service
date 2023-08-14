import { Global, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { Artist } from 'src/database/entity/Artist';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from 'src/database/entity/Track';
import { Album } from 'src/database/entity/Album';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Artist, Track, Album])],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
