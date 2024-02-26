import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sector } from './sector.entity';
import { SectorsService } from './sectors.service';
import { LoggerModule } from '@app/common';
import { SectorsRepository } from './sectors.repository';
import { Industry } from '../industries/industries.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sector, Industry]), LoggerModule],
  providers: [SectorsService, SectorsRepository],
  exports: [SectorsService],
})
export class SectorsModule {}
