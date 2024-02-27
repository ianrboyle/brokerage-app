import { Module } from '@nestjs/common';
import { Sector } from './sector.entity';
import { SectorsService } from './sectors.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { SectorsRepository } from './sectors.repository';
import { Industry } from '../industries/industries.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Sector, Industry]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        DB_PORT: Joi.number().required(),
      }),
    }),
    LoggerModule,
  ],
  providers: [SectorsService, SectorsRepository],
  exports: [SectorsService, SectorsRepository],
})
export class SectorsModule {}
