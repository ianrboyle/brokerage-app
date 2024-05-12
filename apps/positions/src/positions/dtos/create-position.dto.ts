import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePositionDto {
  @IsString()
  symbol: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  costPerShare: number;

  @IsOptional()
  @IsNumber()
  lastPrice: number;

  @IsOptional()
  @IsNumber()
  companyProfileId: number;

  @IsOptional()
  @IsNumber()
  industryId: number;
}
