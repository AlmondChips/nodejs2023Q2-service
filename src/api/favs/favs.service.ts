import { Injectable } from '@nestjs/common';
import { getData } from '../../helpers/getData';
import {
  Album,
  Artist,
  Track,
} from 'src/interfaces/service.resources.interface';

@Injectable()
export class FavsService {
  private artists: Artist[] = [];
  private albums: Album[] = [];
  private tracks: Track[] = [];

  findAll() {
    const { artists, albums, tracks } = this;
    return {
      artists,
      albums,
      tracks,
    };
  }

  addArtist(entity: Artist) {
    this.artists.push(entity);
    return `'${entity.name}' artist added to Favorites`;
  }

  removeArtist(id: string): void {
    const { index } = getData<Artist>(this.artists)(id);
    this.artists.splice(index, 1);
  }

  addAlbum(entity: Album) {
    this.albums.push(entity);
    return `'${entity.name}' album added to Favorites`;
  }

  removeAlbum(id: string): void {
    const { index } = getData<Album>(this.albums)(id);
    this.albums.splice(index, 1);
  }

  addTrack(entity: Track) {
    this.tracks.push(entity);
    return `'${entity.name}' track added to Favorites`;
  }

  removeTrack(id: string): void {
    const { index } = getData<Track>(this.tracks)(id);
    this.tracks.splice(index, 1);
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
