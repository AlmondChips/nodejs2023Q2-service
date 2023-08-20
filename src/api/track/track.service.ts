import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { cascadeDeleteKeyId } from 'src/helpers/cascadeDeleteKey';
import { InjectRepository } from '@nestjs/typeorm';
import { Track } from 'src/database/entity/Track';
import { Repository } from 'typeorm';
import { isExists } from 'src/helpers/isExists';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}
  private tracks: Track[] = [];

  private getTrackData = async (id: string) => {
    const track = await this.trackRepository.findOneBy({ id });
    return isExists(track);
  };

  async create(createTrackDto: CreateTrackDto) {
    const newTrack = {
      ...new Track(),
      ...createTrackDto,
    };
    return await this.trackRepository.save(newTrack);
  }

  async findAll() {
    return await this.trackRepository.find();
  }

  async findOne(id: string) {
    return await this.getTrackData(id);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.getTrackData(id);
    const updatedTrack = {
      ...track,
      ...updateTrackDto,
    };
    return await this.trackRepository.save(updatedTrack);
  }

  async remove(id: string) {
    await this.getTrackData(id);
    await this.trackRepository.delete(id);
  }

  cascadeDeleteArtistId = (id: string) => {
    this.tracks = cascadeDeleteKeyId<Track>(this.tracks, 'artistId')(id);
  };
  cascadeDeleteAlbumId = (id: string) => {
    this.tracks = cascadeDeleteKeyId<Track>(this.tracks, 'albumId')(id);
  };
}
