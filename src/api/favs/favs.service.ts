import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/database/entity/Album';
import { Artist } from 'src/database/entity/Artist';
import { Favorites } from 'src/database/entity/Favorites';
import { Track } from 'src/database/entity/Track';
import { Repository } from 'typeorm';

@Injectable()
export class FavsService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
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
    console.log(favs);
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

  excludeId(fav: Favorites): Omit<Favorites, 'id'> {
    const copy = { ...fav };
    delete copy['id'];
    return copy;
  }

  async findAll() {
    return await this.excludeId(await this.getFav());
  }

  async addArtist(entity: Artist) {
    const favs = await this.getFav();
    favs.artists.push(entity);
    await this.favoritesRepository.save(favs);
    return `'${entity.name}' artist added to Favorites`;
  }

  async removeArtist(id: string): Promise<void> {
    const favs = await this.getFav();
    favs.artists = favs.artists.filter((artist) => artist.id !== id);
    await this.favoritesRepository.save(favs);
  }

  async addAlbum(entity: Album) {
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
    const favs = await this.getFav();
    favs.tracks.push(entity);
    await this.favoritesRepository.save(favs);
    return `'${entity.name}' track added to Favorites`;
  }

  async removeTrack(id: string): Promise<void> {
    const favs = await this.getFav();
    favs.tracks = favs.tracks.filter((album) => album.id !== id);
    await this.favoritesRepository.save(favs);
  }

  // from other modules
  removeOnFindArtist(id: string) {
    this.artists.forEach((item, idx) => {
      if (item.id === id) {
        this.artists.splice(idx, 1);
      }
    });
  }

  removeOnFindTrack(id: string) {
    this.tracks.forEach((item, idx) => {
      if (item.id === id) {
        this.tracks.splice(idx, 1);
      }
    });
  }

  removeOnFindAlbums(id: string) {
    this.albums.forEach((item, idx) => {
      if (item.id === id) {
        this.albums.splice(idx, 1);
      }
    });
  }
}
