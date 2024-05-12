import { Module } from '@nestjs/common';
import { Sector } from './sector.entity';
import { SectorsService } from './sectors.service';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { SectorsRepository } from './sectors.repository';
import { Industry } from '../industries/industries.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { SectorsController } from './sectors.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [SectorsController],
  providers: [SectorsService, SectorsRepository],
  exports: [SectorsService, SectorsRepository],
})
export class SectorsModule {}
