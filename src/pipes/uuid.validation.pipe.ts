import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'uuid';
// REMOVE
@Injectable()
export class UUIDValidationPipe implements PipeTransform {
  transform(value: string) {
    if (!validate(value)) {
      throw new BadRequestException('Invalid UUID');
    }
    return value;
  }
}
