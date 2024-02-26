import { NestFactory } from '@nestjs/core';
import { PositionsModule } from './positions/positions.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PositionsModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useLogger(app.get(Logger));
  app.use(cookieParser());
  const configService = app.get(ConfigService);
  await app.listen(configService.get('HTTP_PORT'));
}
bootstrap();
