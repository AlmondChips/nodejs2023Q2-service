import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/database/entity/Album';
import { Repository } from 'typeorm';
import { isExists } from 'src/helpers/isExists';
import { Artist } from 'src/database/entity/Artist';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}
  private albums: Album[] = [];

  private getAlbumData = async (id: string) => {
    const album = await this.albumRepository.findOneBy({ id });
    return isExists(album);
  };

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = {
      ...new Album(),
      ...createAlbumDto,
    };
    return await this.albumRepository.save(newAlbum);
  }

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.getAlbumData(id);
    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const album = await this.getAlbumData(id);
    const updatedAlbum = {
      ...album,
      ...updateAlbumDto,
    };
    return await this.albumRepository.save(updatedAlbum);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.albumRepository.delete(id);
  }

  cascadeDeleteArtistId(id: string) {
    const updatedAlbums = this.albums.map((album) => {
      return album;
    });
    this.albums = updatedAlbums;
  }
}
