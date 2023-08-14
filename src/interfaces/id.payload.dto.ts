import { IsUUID } from 'class-validator';

export class IdPayloadDto {
  @IsUUID('4')
  id: string;
}
