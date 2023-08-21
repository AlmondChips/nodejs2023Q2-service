import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from 'src/database/entity/User';
import { Artist } from 'src/database/entity/Artist';
import { Album } from 'src/database/entity/Album';
import { Track } from 'src/database/entity/Track';
import { Favorites } from 'src/database/entity/Favorites';
import { LoggingService } from './logging/logging.service';

config();
const {
  POSTGRES_PASSWORD,
  POSTGRES_USER,
  POSTGRES_DB,
  POSTGRES_HOST,
  POSTGRES_PORT,
} = process.env;
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST,
      port: Number(POSTGRES_PORT),
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_DB,
      synchronize: true,
      logging: false,
      entities: [User, Artist, Album, Track, Favorites],
      migrations: [__dirname + 'src/database/migration/*{.ts,.js}'],
      migrationsRun: true,
      subscribers: [],
    }),
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavsModule,
  ],
})
export class AppModule {}
