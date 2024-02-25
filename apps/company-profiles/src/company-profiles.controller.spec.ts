import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesController } from './company-profiles.controller';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfile, CreateCompanyProfileDto } from '@app/common';

describe('CompanyProfilesController', () => {
  let companyProfilesController: CompanyProfilesController;
  let fakeCompanyProfilesService: Partial<CompanyProfilesService>;
  beforeEach(async () => {
    const mockCompanyProfiles: CompanyProfile[] = [mockCompanyProfileDataOne];
    fakeCompanyProfilesService = {
      createNew: (symbol: string) => {
        const companyProfile: CompanyProfile = {
          symbol: symbol,
          price: 100,
          id: Math.floor(Math.random() * 99999),
          companyName: '',
          industry: 'Computers and Manufacturing',
          sector: 'Tech',
          country: '',
          isCustomProfile: false,
        };
        mockCompanyProfiles.push(companyProfile);
        return Promise.resolve(companyProfile);
      },
      findBySymbol: (symbol: string) => {
        const filteredProfiles = mockCompanyProfiles.filter(
          (c) => c.symbol === symbol,
        );
        const returnedProfile =
          filteredProfiles.length > 0 ? filteredProfiles[0] : null;
        return Promise.resolve(returnedProfile);
      },
      createCustomCompanyProfile: (
        createCompanyProfileDto: CreateCompanyProfileDto,
      ) => {
        const companyProfile: CompanyProfile = {
          symbol: createCompanyProfileDto.symbol,
          price: createCompanyProfileDto.price,
          id: Math.floor(Math.random() * 99999),
          companyName: createCompanyProfileDto.companyName,
          industry: createCompanyProfileDto.industry,
          sector: createCompanyProfileDto.sector,
          country: createCompanyProfileDto.country,
          isCustomProfile: true,
        };

        return Promise.resolve(companyProfile);
      },
    };
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CompanyProfilesController],
      providers: [
        {
          provide: CompanyProfilesService,
          useValue: fakeCompanyProfilesService,
        },
      ],
    }).compile();

    companyProfilesController = app.get<CompanyProfilesController>(
      CompanyProfilesController,
    );
  });

  it('getCompanyProfile should return a company profile', async () => {
    const companyProfile =
      await companyProfilesController.getCompanyProfile('AAPL');
    expect(companyProfile.symbol).toBe('AAPL');
  });

  it('getCompanyProfile should return null', async () => {
    fakeCompanyProfilesService.findBySymbol = () => {
      return Promise.resolve(null);
    };
    const companyProfile =
      await companyProfilesController.getCompanyProfile('AAPL');
    expect(companyProfile).toBe(null);
  });

  it('createCompanyProfile should return a company profile', async () => {
    const companyProfile =
      await companyProfilesController.createNewCompanyProfile('AAPL');
    expect(companyProfile.symbol).toBe('AAPL');
  });

  const mockCompanyProfileDataOne: CompanyProfile = {
    id: 1,
    symbol: 'AAPL',
    price: 150.5,
    companyName: '',
    industry: '',
    sector: '',
    country: '',
    isCustomProfile: false,
  };
  // const mockCompanyProfileDataTwo: CompanyProfile = {
  //   id: 2,
  //   symbol: 'GOOGL',
  //   price: 150.5,
  //   companyName: '',
  //   industry: '',
  //   sector: '',
  //   country: '',
  //   isCustomProfile: false,
  // };
});
