import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from 'src/interfaces/service.resources.interface';
import { getData } from 'src/helpers/getData';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class ArtistService {
  private readonly artists: Artist[] = [];

  private getArtistData = getData<Artist>(this.artists);

  create(createArtistDto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: uuid4(),
      ...createArtistDto,
    };
    this.artists.push(newArtist);
    return newArtist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const { data } = this.getArtistData(id);
    return data;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    const { data, index } = this.getArtistData(id);
    const updatedArtist = {
      ...data,
      ...updateArtistDto,
    };
    this.artists.splice(index, 1, updatedArtist);
    return updatedArtist;
  }

  remove(id: string) {
    const { index } = this.getArtistData(id);
    this.artists.splice(index, 1);
  }
}
