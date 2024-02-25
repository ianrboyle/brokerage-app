import { Module } from '@nestjs/common';
import { CompanyProfilesController } from './company-profiles.controller';
import { CompanyProfilesService } from './company-profiles.service';
import { DatabaseModule, LoggerModule, CompanyProfile } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { CompanyProfilesRepository } from './company-profile.repository';
// import { FinancialModelingPrepService } from './financialModelingPrep/financial-modeling-prep.service';
import { FinancialModelingPrepModule } from './financialModelingPrep/financial-modeling-prep.module';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([CompanyProfile]),
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
    FinancialModelingPrepModule,
  ],
  controllers: [CompanyProfilesController],
  providers: [CompanyProfilesService, CompanyProfilesRepository],
})
export class CompanyProfilesModule {}
