import { NotFoundException } from '@nestjs/common';

export const getData = <T extends { id: string }>(source: T[]) => {
  return (id: string): { data: T; index: number } => {
    const index = source.findIndex((data) => data.id === id);
    if (index === -1) {
      throw new NotFoundException();
    }
    return { data: source[index], index };
  };
};
