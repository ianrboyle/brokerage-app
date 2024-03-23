import { Module } from '@nestjs/common';
import { Industry } from './industries.entity';
import { IndustriesService } from './industries.service';
import { IndustriesRepository } from './industries.repository';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { IndustriesController } from './industries.controller';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Industry]),
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
  controllers: [IndustriesController],
  providers: [IndustriesService, IndustriesRepository],
  exports: [IndustriesService, IndustriesRepository],
})
export class IndustriesModule {}
