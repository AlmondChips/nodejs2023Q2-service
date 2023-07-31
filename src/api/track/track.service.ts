import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from 'src/interfaces/service.resources.interface';
import { getData } from 'src/helpers/getData';
import { v4 } from 'uuid';
import { cascadeDeleteKeyId } from 'src/helpers/cascadeDeleteKey';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  private getTrackData = (id: string) => {
    return getData<Track>(this.tracks)(id);
  };

  create(createTrackDto: CreateTrackDto) {
    const newTrack: Track = {
      id: v4(),
      artistId: null,
      albumId: null,
      ...createTrackDto,
    };
    this.tracks.push(newTrack);
    return newTrack;
  }

  findAll() {
    return this.tracks;
  }

  async findOne(id: string) {
    const { data } = await this.getTrackData(id);
    return data;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { data, index } = this.getTrackData(id);
    const updatedTrack = {
      ...data,
      ...updateTrackDto,
    };
    this.tracks.splice(index, 1, updatedTrack);
    return updatedTrack;
  }

  remove(id: string) {
    const { index } = this.getTrackData(id);
    this.tracks.splice(index, 1);
  }

  cascadeDeleteArtistId = (id: string) => {
    this.tracks = cascadeDeleteKeyId<Track>(this.tracks, 'artistId')(id);
  };
  cascadeDeleteAlbumId = (id: string) => {
    this.tracks = cascadeDeleteKeyId<Track>(this.tracks, 'albumId')(id);
  };
}
