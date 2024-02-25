import {
  Controller,
  Get,
  Param,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyProfilesService } from './company-profiles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class CompanyProfilesController {
  constructor(
    private readonly companyProfilesService: CompanyProfilesService,
  ) {}

  @MessagePattern('create_new_profile')
  @UsePipes(new ValidationPipe())
  async createNewCompanyProfile(@Payload() data: string) {
    return this.companyProfilesService.createNew(data);
  }
  @MessagePattern('get_profile')
  @UsePipes(new ValidationPipe())
  async getCompanyProfile(@Payload() data: string) {
    return this.companyProfilesService.findBySymbol(data);
  }

  @Get('/:symbol')
  async getPositionById(@Param('symbol') symbol: string) {
    return await this.companyProfilesService.findBySymbol(symbol);
  }
}
