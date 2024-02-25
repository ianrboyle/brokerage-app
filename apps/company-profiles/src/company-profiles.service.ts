import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CompanyProfilesRepository } from './company-profile.repository';
import { CompanyProfile, CreateCompanyProfileDto } from '@app/common';
import { FinancialModelingPrepService } from './financialModelingPrep/financial-modeling-prep.service';

@Injectable()
export class CompanyProfilesService {
  DEFAULT_PROFILE: CreateCompanyProfileDto = {
    symbol: 'default',
    companyName: 'custom profile required',
    price: 0,
    sector: 'Default Sector',
    industry: 'Default Industry',
    country: '',
    isCustomProfile: false,
  };
  constructor(
    private readonly companyProfilesRepository: CompanyProfilesRepository,
    private financialPrepModelingService: FinancialModelingPrepService,
  ) {}
  async createNew(symbol: string) {
    const profile =
      await this.financialPrepModelingService.getCompanyProfile(symbol);
    if (!profile) {
      return this.getDefaultProfile();
    }

    const companyProfileDto: CreateCompanyProfileDto = {
      symbol: profile.symbol,
      companyName: profile.companyName,
      price: profile?.price || 0,
      industry: profile.industry,
      sector: profile.sector,
      country: profile?.country,
      isCustomProfile: false,
    };

    return this.create(companyProfileDto);
  }

  async create(createCompanyProfileDto: CreateCompanyProfileDto) {
    const companyProfile = new CompanyProfile({
      ...createCompanyProfileDto,
    });
    return await this.companyProfilesRepository.create(companyProfile);
  }

  findAll() {
    return this.companyProfilesRepository.find({});
  }

  findOne(id: number) {
    return this.companyProfilesRepository.findOne({ id });
  }

  remove(id: number) {
    return this.companyProfilesRepository.findOneAndDelete({ id });
  }

  async findBySymbol(symbol: string) {
    const companyProfiles = await this.companyProfilesRepository.find({
      symbol,
    });
    if (companyProfiles && companyProfiles.length > 0)
      return companyProfiles[0];
    return null;
  }

  getDefaultProfile = async () => {
    try {
      const defaultProfile = await this.findBySymbol(
        this.DEFAULT_PROFILE.symbol,
      );

      if (!defaultProfile) {
        return await this.create(this.DEFAULT_PROFILE);
      }
      return defaultProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create default company profile',
      );
    }
  };

  createCustomCompanyProfile = async (
    createCompanyProfileDto: CreateCompanyProfileDto,
  ) => {
    try {
      return await this.create(createCompanyProfileDto);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create custom company profile: ${createCompanyProfileDto}`,
      );
    }
  };
}
