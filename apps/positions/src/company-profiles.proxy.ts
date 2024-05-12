import { Inject, Injectable } from '@nestjs/common';
import { COMPANY_PROFILES_SERVICE, CompanyProfile } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CompanyProfilesProxy {
  constructor(
    @Inject(COMPANY_PROFILES_SERVICE)
    private readonly companyProfilesService: ClientProxy,
  ) {}

  public async getOrCreateCompanyProfile(symbol: string) {
    const profile = await this.getCompanyProfile(symbol);
    if (!profile) {
      return await this.createCompanyProfile(symbol);
    }
    return profile;
  }
  private async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const getProfileResponse = this.companyProfilesService.send(
      'get_profile',
      symbol,
    );

    return await firstValueFrom<CompanyProfile>(getProfileResponse);
  }

  private async createCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const createProfileResponse = this.companyProfilesService.send(
      'create_new_profile',
      symbol,
    );

    return await firstValueFrom<CompanyProfile>(createProfileResponse);
  }
  public async updateCompanyProfile(
    id: number,
    profile: CompanyProfile,
  ): Promise<CompanyProfile> {
    const partialProfile: Partial<CompanyProfile> = {
      ...profile,
    };
    const data = { id: id, profile: partialProfile };
    const createProfileResponse = this.companyProfilesService.send(
      'update_company_profile',
      data,
    );

    return await firstValueFrom<CompanyProfile>(createProfileResponse);
  }
}
