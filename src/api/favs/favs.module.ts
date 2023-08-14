import { Global, Module } from '@nestjs/common';
import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from 'src/database/entity/Artist';
import { Album } from 'src/database/entity/Album';
import { Track } from 'src/database/entity/Track';
import { Favorites } from 'src/database/entity/Favorites';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Artist, Album, Track, Favorites])],
  controllers: [FavsController],
  providers: [FavsService],
  exports: [FavsService],
})
export class FavsModule {}
