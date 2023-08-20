import { Global, Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/database/entity/Artist';
import { Album } from 'src/database/entity/Album';
import { Track } from 'src/database/entity/Track';
import { Favorites } from 'src/database/entity/Favorites';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Artist, Album, Track, Favorites]),
    ArtistModule,
    TrackModule,
    AlbumModule,
  ],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
