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

@Controller('track')
export class TrackController {
  constructor(
    private readonly trackService: TrackService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    const { artistId, albumId } = createTrackDto;
    if (artistId)
      await this.artistService.findOne(artistId).catch(() => {
        throw new NotFoundException(
          `Artist with id='${artistId}' does not exist`,
        );
      });
    if (albumId)
      await this.albumService.findOne(albumId).catch(() => {
        throw new NotFoundException(
          `Album with id='${albumId}' does not exist`,
        );
      });

    return this.trackService.create(createTrackDto);
  }

  @Get()
  findAll() {
    return this.trackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    return this.trackService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    this.trackService.remove(id);
    this.favsService.removeOnFindTrack(id);
    return;
  }
}
