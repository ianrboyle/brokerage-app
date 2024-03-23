import { IsObject, IsString } from 'class-validator';
import { Sector } from '../../sectors/sector.entity';

export class CreateIndustryDto {
  @IsString()
  industryName: string;

  @IsObject()
  sector: Sector;
}
