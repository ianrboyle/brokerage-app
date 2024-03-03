import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import {
  DatabaseModule,
  LoggerModule,
  AUTH_SERVICE,
  COMPANY_PROFILES_SERVICE,
  Position,
  User,
} from '@app/common';
import { PositionsRepository } from './positions.repository';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { SectorsModule } from '../sectors/sectors.module';
import { IndustriesModule } from '../industries/industries.module';
import { Industry } from '../industries/industries.entity';
import { PortfolioService } from '../portfolio/portfolio.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Position, User, Industry]),
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
      {
        name: COMPANY_PROFILES_SERVICE,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('COMPANY_PROFILES_HOST'),
            port: configService.get('COMPANY_PROFILES_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    SectorsModule,
    IndustriesModule,
  ],
  controllers: [PositionsController],
  providers: [
    PositionsService,
    PositionsRepository,
    CompanyProfilesProxy,
    PortfolioService,
  ],
})
export class PositionsModule {}
