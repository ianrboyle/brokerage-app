import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { CompanyProfilesService } from './company-profiles.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyProfile } from '../../../libs/common/src';

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
  @MessagePattern('update_company_profile')
  @UsePipes(new ValidationPipe())
  async updateCompanyProfile(
    @Payload() data: { id: number; profile: Partial<CompanyProfile> },
  ) {
    return this.companyProfilesService.updateCompanyProfile(
      data.id,
      data.profile,
    );
  }
}
