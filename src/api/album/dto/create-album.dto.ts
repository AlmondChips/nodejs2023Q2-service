import { IsNumber, IsString } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsNumber()
  year: number;

  @IsString()
  artistId: string | null; // refers to Artist
}
