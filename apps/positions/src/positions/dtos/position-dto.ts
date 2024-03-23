import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class PositionDto {
  @Expose()
  id: number;

  @Expose()
  symbol: string;

  @Expose()
  quantity: number;

  @Expose()
  costPerShare: number;

  @IsOptional()
  @Transform(({ obj }) => (obj.user ? obj.user.id : null))
  @Expose()
  userId: number;

  @Expose()
  companyProfileId: number;

  @Expose()
  industryId: number;
}
