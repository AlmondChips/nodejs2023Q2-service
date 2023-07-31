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

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    const { artistId } = createAlbumDto;
    try {
      if (artistId) this.artistService.findOne(artistId);
    } catch (error) {
      throw new NotFoundException(
        `Artist with id='${artistId}' does not exist`,
      );
    }
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
  update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', UUIDValidationPipe) id: string) {
    this.albumService.remove(id);
    this.trackService.cascadeDeleteAlbumId(id);
    this.favsService.removeOnFindAlbums(id);
    return;
  }
}
