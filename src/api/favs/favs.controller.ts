import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  UnprocessableEntityException,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from 'src/database/entity/Album';
import { Artist } from 'src/database/entity/Artist';
import { Repository } from 'typeorm';
import { Track } from 'src/database/entity/Track';
import { isExists } from 'src/helpers/isExists';

@Controller('favs')
export class FavsController {
  constructor(
    private readonly favsService: FavsService,
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  @Get()
  async findAll() {
    return await this.favsService.findAll();
  }

  @Post('/artist/:id')
  async addArtist(@Param('id', UUIDValidationPipe) id: string) {
    const artist = await this.artistRepository
      .findOneBy({ id })
      .then((item) => {
        return isExists(item);
      })
      .catch(() => {
        throw new UnprocessableEntityException(
          `Artist with id='${id}' does not exist`,
        );
      });
    return await this.favsService.addArtist(artist);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', UUIDValidationPipe) id: string) {
    return await this.favsService.removeArtist(id);
  }

  @Post('/album/:id')
  async addAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const album = await this.albumRepository
      .findOneBy({ id })
      .then((item) => {
        return isExists(item);
      })
      .catch(() => {
        throw new UnprocessableEntityException(
          `Album with id='${id}' does not exist`,
        );
      });
    return await this.favsService.addAlbum(album);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', UUIDValidationPipe) id: string) {
    return await this.favsService.removeAlbum(id);
  }

  @Post('/track/:id')
  async addTrack(@Param('id', UUIDValidationPipe) id: string) {
    const track = await this.trackRepository
      .findOneBy({ id })
      .then((item) => {
        return isExists(item);
      })
      .catch(() => {
        throw new UnprocessableEntityException(
          `Track with id='${id}' does not exist`,
        );
      });

    return await this.favsService.addTrack(track);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', UUIDValidationPipe) id: string) {
    return await this.favsService.removeTrack(id);
  }
}
