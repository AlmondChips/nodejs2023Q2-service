import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavsService } from '../favs/favs.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/database/entity/Artist';
import { Repository } from 'typeorm';
import { isExists } from 'src/helpers/isExists';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  @Post()
  async create(@Body() createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;
    this.checkIfArtistValid(artistId);
    return this.albumService.create(createAlbumDto);
  }

  @Get()
  findAll() {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    const { artistId } = updateAlbumDto;
    await this.checkIfArtistValid(artistId);
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    return await this.albumService.remove(id);
  }

  async checkIfArtistValid(artistId) {
    try {
      if (artistId) {
        const artist = await this.artistRepository.findOneBy({ id: artistId });
        isExists(artist);
      }
    } catch (error) {
      throw new NotFoundException(
        `Artist with id='${artistId}' does not exist`,
      );
    }
  }
}
