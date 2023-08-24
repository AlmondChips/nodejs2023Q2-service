import { IsString } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsString()
  oldPassword: string; // previous password
  @IsString()
  newPassword: string; // new password
}
