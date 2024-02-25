import { Module } from '@nestjs/common';
import { FinancialModelingPrepService } from './financial-modeling-prep.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    ConfigModule,
  ],
  providers: [FinancialModelingPrepService, ConfigService],
  exports: [FinancialModelingPrepService],
})
export class FinancialModelingPrepModule {}
