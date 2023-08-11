import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavsModule } from './favs/favs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { User } from 'src/database/entity/User';

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
      entities: [User],
      migrations: [],
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
