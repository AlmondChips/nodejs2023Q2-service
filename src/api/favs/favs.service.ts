import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/database/entity/Album';
import { Artist } from 'src/database/entity/Artist';
import { Favorites } from 'src/database/entity/Favorites';
import { Track } from 'src/database/entity/Track';
import { Repository } from 'typeorm';
import { TrackService } from '../track/track.service';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { isExists } from 'src/helpers/isExists';

enum favoriteCategories {
  albums = 'albums',
  tracks = 'tracks',
  artists = 'artists',
}
@Injectable()
export class FavsService {
  constructor(
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
  ) {}

  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];

  private async getFav(): Promise<Favorites> {
    const favs = await this.favoritesRepository.findOne({
      where: {},
    });
    if (!favs) {
      const newFav = {
        artists: [],
        albums: [],
        tracks: [],
      };
      await this.favoritesRepository.save(newFav);
    }
    return await this.favoritesRepository.findOne({
      where: {},
    });
  }

  private async isInFavs<T extends Album | Track | Artist>(
    id: string,
    entity: favoriteCategories,
  ) {
    const favs = await this.getFav();
    const list = favs[entity] as T[];
    if (list) {
      const item = list.find((item) => item.id === id);
      if (!item) throw new UnprocessableEntityException();
    } else {
      throw new Error('Incorrect entity name');
    }
  }

  excludeId(fav: Favorites): Omit<Favorites, 'id'> {
    const copy = { ...fav };
    delete copy['id'];
    return copy;
  }

  async findAll() {
    return await this.excludeId(await this.getFav());
  }

  async addArtist(entity: Artist) {
    isExists(entity);
    const favs = await this.getFav();
    favs.artists.push(entity);
    await this.favoritesRepository.save(favs);
    return `'${entity.name}' artist added to Favorites`;
  }

  async removeArtist(id: string): Promise<void> {
    await this.isInFavs<Artist>(id, favoriteCategories.artists);
    const favs = await this.getFav();
    favs.artists = favs.artists.filter((artist) => artist.id !== id);
    await this.favoritesRepository.save(favs);
  }

  async addAlbum(entity: Album) {
    isExists(entity);
    const favs = await this.getFav();
    favs.albums.push(entity);
    await this.favoritesRepository.save(favs);
    return `'${entity.name}' album added to Favorites`;
  }

  async removeAlbum(id: string): Promise<void> {
    const favs = await this.getFav();
    favs.albums = favs.albums.filter((album) => album.id !== id);
    await this.favoritesRepository.save(favs);
  }

  async addTrack(entity: Track) {
    isExists(entity);
    const favs = await this.getFav();
    favs.tracks.push(entity);
    await this.favoritesRepository.save(favs);
    return `'${entity.name}' track added to Favorites`;
  }

  async removeTrack(id: string): Promise<Favorites> {
    await this.isInFavs<Track>(id, favoriteCategories.tracks);
    const favs = await this.getFav();
    favs.tracks = favs.tracks.filter((track) => track.id !== id);
    return await this.favoritesRepository.save(favs);
  }
}
