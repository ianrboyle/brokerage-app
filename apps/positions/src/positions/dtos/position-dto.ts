import { Expose } from 'class-transformer';

export class PositionDto {
  @Expose()
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  quantity: number;

  @Expose()
  costPerShare: number;

  @Expose()
  industryId: number;
  @Expose()
  industryName: string;
  @Expose()
  sectorId: number;
  @Expose()
  sectorName: string;
  @Expose()
  companyName: string;

  @Expose()
  percentGain: number;

  @Expose()
  totalCostBasis: number;
  @Expose()
  currentValue: number;
}
