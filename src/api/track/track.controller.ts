import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  HttpCode,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { FavsService } from '../favs/favs.service';
import { Album } from 'src/database/entity/Album';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from 'src/database/entity/Artist';

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;
    if (artistId)
      await this.artistRepository.findOneBy({ id: artistId }).catch(() => {
        throw new NotFoundException(
          `Artist with id='${artistId}' does not exist`,
        );
      });
    if (albumId)
      await this.albumRepository.findOneBy({ id: albumId }).catch(() => {
        throw new NotFoundException(
          `Album with id='${albumId}' does not exist`,
        );
      });

    return await this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    const { artistId, albumId } = updateTrackDto;
    if (artistId)
      await this.artistRepository.findOneBy({ id: artistId }).catch(() => {
        throw new NotFoundException(
          `Artist with id='${artistId}' does not exist`,
        );
      });
    if (albumId)
      await this.albumRepository.findOneBy({ id: albumId }).catch(() => {
        throw new NotFoundException(
          `Album with id='${albumId}' does not exist`,
        );
      });
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    return await this.trackService.remove(id);
  }
}
