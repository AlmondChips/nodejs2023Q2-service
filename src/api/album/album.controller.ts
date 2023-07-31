import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { UUIDValidationPipe } from '../pipes/uuid.validation.pipe';
import { ArtistService } from '../artist/artist.service';

@Controller('album')
export class AlbumController {
  constructor(
    private readonly albumService: AlbumService,
    private readonly artistService: ArtistService,
  ) {}

  @Post()
  create(@Body() createAlbumDto: CreateAlbumDto) {
    try {
      this.artistService.findOne(createAlbumDto.artistId);
    } catch (error) {
      throw new NotFoundException(
        `Artist with id='${createAlbumDto.artistId}' does not exist`,
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
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.albumService.remove(id);
  }
}
