import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UnprocessableEntityException,
  HttpCode,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';

@Controller('favs')
export class FavsController {
  constructor(
    private readonly favsService: FavsService,
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('/artist/:id')
  async addArtist(@Param('id', UUIDValidationPipe) id: string) {
    const artist = await this.artistService.findOne(id).catch(() => {
      throw new UnprocessableEntityException(
        `Artist with id='${id}' does not exist`,
      );
    });
    return this.favsService.addArtist(artist);
  }

  @Delete('/artist/:id')
  @HttpCode(204)
  async deleteArtist(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeArtist(id);
  }

  @Post('/album/:id')
  async addAlbum(@Param('id', UUIDValidationPipe) id: string) {
    const album = await this.albumService.findOne(id).catch(() => {
      throw new UnprocessableEntityException(
        `Album with id='${id}' does not exist`,
      );
    });
    return this.favsService.addAlbum(album);
  }

  @Delete('/album/:id')
  @HttpCode(204)
  async deleteAlbum(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeAlbum(id);
  }

  @Post('/track/:id')
  async addTrack(@Param('id', UUIDValidationPipe) id: string) {
    const track = await this.trackService.findOne(id).catch(() => {
      throw new UnprocessableEntityException(
        `Track with id='${id}' does not exist`,
      );
    });
    return this.favsService.addTrack(track);
  }

  @Delete('/track/:id')
  @HttpCode(204)
  async deleteTrack(@Param('id', UUIDValidationPipe) id: string) {
    return this.favsService.removeTrack(id);
  }
}
