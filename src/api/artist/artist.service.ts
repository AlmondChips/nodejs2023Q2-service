import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { v4 as uuid4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Artist } from 'src/database/entity/Artist';
import { Repository } from 'typeorm';
import { isExists } from 'src/helpers/isExists';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,
  ) {}

  private getArtistData = async (id: string) => {
    const artist = await this.artistRepository.findOneBy({ id });
    return isExists(artist);
  };

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const newArtist: Omit<Artist, 'id'> = {
      ...createArtistDto,
    };
    return await this.artistRepository.save(newArtist);
  }

  async findAll(): Promise<Artist[]> {
    return await this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    const aritst = await this.getArtistData(id);
    return aritst;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.getArtistData(id);
    const newArtist = {
      ...artist,
      ...updateArtistDto,
    };
    return this.artistRepository.save(newArtist);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.artistRepository.delete({ id });
  }
}
