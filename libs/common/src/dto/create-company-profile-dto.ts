import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCompanyProfileDto {
  @IsString()
  symbol: string;

  @IsString()
  companyName: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsString()
  sector: string;

  @IsString()
  industry: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsBoolean()
  isCustomProfile: boolean = false;
}
