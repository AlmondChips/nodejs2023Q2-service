import { NotFoundException } from '@nestjs/common';

export const isExists = <T>(entity: T): T => {
  if (!entity || Object.keys(entity).length === 0) {
    throw new NotFoundException();
  }
  return entity;
};
