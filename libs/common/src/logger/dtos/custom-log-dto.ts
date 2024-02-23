import { IsDate, IsNumber, IsString } from 'class-validator';

export class CustomLogDto {
  @IsNumber()
  statusCode: number;

  @IsString()
  path: string;

  @IsString()
  message: string;

  @IsString()
  stack: string;

  @IsString()
  exceptionName: string;

  @IsDate()
  timestamp: Date;
}
