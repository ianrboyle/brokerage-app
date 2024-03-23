import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { Sector } from '../../sectors/sector.entity';

export class IndustryDto {
  @Expose()
  id: number;

  @Expose()
  industryName: string;

  @Expose()
  sector: Sector;

  @IsOptional()
  @Transform(({ obj }) => (obj.sector ? obj.sector.id : null))
  @Expose()
  sectorId: number;
}
