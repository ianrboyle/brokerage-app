import { IsString } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  sectorName: string;
}
