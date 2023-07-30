import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {
  @IsString()
  @IsOptional()
  name: string;

  @IsBoolean()
  @IsOptional()
  grammy: boolean;
}
