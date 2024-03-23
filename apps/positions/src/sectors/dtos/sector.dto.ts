import { Expose } from 'class-transformer';
import { Industry } from '../../industries/industries.entity';

export class SectorDto {
  @Expose()
  id: number;

  @Expose()
  sectorName: string;

  @Expose()
  industries: Industry[];
}
