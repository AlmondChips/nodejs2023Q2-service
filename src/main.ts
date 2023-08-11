import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

import 'reflect-metadata';

config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(port, () =>
    console.log(`Server is listening on port!!! `, port),
  );
}
bootstrap();
