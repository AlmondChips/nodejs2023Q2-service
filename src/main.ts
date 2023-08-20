import { NestFactory } from '@nestjs/core';
import { AppModule } from './api/app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import * as yaml from 'js-yaml';

import 'reflect-metadata';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'path';

config();

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const apiDocYaml = yaml.load(
    await readFile(join(__dirname, '../doc/api.yaml'), { encoding: 'utf-8' }),
  );

  SwaggerModule.setup('doc', app, apiDocYaml as OpenAPIObject);

  await app.listen(port, () =>
    console.log(`Server is listening on port!!! `, port),
  );
}
bootstrap();
