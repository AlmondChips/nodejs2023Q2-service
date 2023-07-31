import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from 'src/interfaces/service.resources.interface';
import { getData } from 'src/helpers/getData';
import { v4 } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  private getAlbumData = (id: string) => {
    return getData<Album>(this.albums)(id);
  };

  create(createAlbumDto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: v4(),
      artistId: null,
      ...createAlbumDto,
    };
    this.albums.push(newAlbum);
    return newAlbum;
  }

  findAll(): Album[] {
    return this.albums;
  }

  async findOne(id: string): Promise<Album> {
    const { data } = this.getAlbumData(id);
    return data;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const { data, index } = this.getAlbumData(id);
    const updatedAlbum = {
      ...data,
      ...updateAlbumDto,
    };
    this.albums.splice(index, 1, updatedAlbum);
    return updatedAlbum;
  }

  remove(id: string): void {
    const { index } = this.getAlbumData(id);
    this.albums.splice(index, 1);
  }

  cascadeDeleteArtistId(id: string) {
    const updatedAlbums = this.albums.map((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
      return album;
    });
    this.albums = updatedAlbums;
  }
}
