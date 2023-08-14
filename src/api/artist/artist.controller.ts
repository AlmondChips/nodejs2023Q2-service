import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavsService } from '../favs/favs.service';

@Controller('artist')
export class ArtistController {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favsService: FavsService,
  ) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', UUIDValidationPipe) id: string) {
    return await this.artistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', UUIDValidationPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', UUIDValidationPipe) id: string) {
    this.favsService.removeOnFindArtist(id);
    await this.artistService.remove(id);
    this.albumService.cascadeDeleteArtistId(id);
    this.trackService.cascadeDeleteArtistId(id);
    return;
  }
}
