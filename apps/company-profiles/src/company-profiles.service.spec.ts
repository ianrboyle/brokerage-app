import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesService } from './company-profiles.service';
import { FinancialModelingPrepService } from './financialModelingPrep/financial-modeling-prep.service';
import { CompanyProfile, CreateCompanyProfileDto } from '@app/common';
import { CreatePositionDto } from '../../positions/src/dto/create-position.dto';
import { Profile } from './financialModelingPrep/models/profile';
import { CompanyProfilesRepository } from './company-profile.repository';
import { EntityManager } from 'typeorm';

describe('CompanyProfilesService', () => {
  let service: CompanyProfilesService;
  let fakeFMPService: Partial<FinancialModelingPrepService>;
  let fakeCompanyProfilesRepo: Partial<CompanyProfilesRepository>;
  beforeEach(async () => {
    fakeFMPService = {
      getCompanyProfile: (symbol: string) => {
        if (symbol != 'default') {
          return Promise.resolve(mockStockData[0]);
        }
        return null;
      },
    };
    const mockCompanyProfiles: CompanyProfile[] = [mockCompanyProfileDataOne];
    fakeCompanyProfilesRepo = {
      create: () => {
        const companyProfile: CompanyProfile = {
          symbol: 'AAPL',
          price: 100,
          id: Math.floor(Math.random() * 99999),
          companyName: '',
          industry: 'Computers and Manufacturing',
          sector: 'Tech',
          country: '',
          isCustomProfile: false,
        };
        mockCompanyProfiles.push();
        return Promise.resolve(companyProfile);
      },
      find: () => {
        const filteredProfiles = mockCompanyProfiles.filter(
          (c) => c.symbol === 'TEST',
        );

        return Promise.resolve(filteredProfiles);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyProfilesService,
        {
          provide: FinancialModelingPrepService,
          useValue: fakeFMPService,
        },
        {
          provide: CompanyProfilesRepository,
          useValue: fakeCompanyProfilesRepo,
        },
        EntityManager,
      ],
    }).compile();

    service = module.get<CompanyProfilesService>(CompanyProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new companyProfile', async () => {
    fakeCompanyProfilesRepo.create = () => {
      return Promise.resolve(mockCompanyProfileDataOne);
    };
    const profile = await service.createNew(mockCreatePositionDtoOne.symbol);

    expect(profile.symbol).toEqual(mockCreatePositionDtoOne.symbol);
  });

  it('findBySymbol should find a companyProfile with symbol AAPL', async () => {
    fakeCompanyProfilesRepo.find = () => {
      return Promise.resolve([mockCompanyProfileDataOne]);
    };
    const profile = await service.findBySymbol(mockCreatePositionDtoOne.symbol);

    expect(profile.symbol).toEqual(mockCreatePositionDtoOne.symbol);
  });

  it('findBySymbol should return null', async () => {
    fakeCompanyProfilesRepo.find = () => {
      return Promise.resolve(null);
    };
    const profile = await service.findBySymbol(mockCreatePositionDtoOne.symbol);

    expect(profile).toBeNull();
  });

  it('create should create and return a default profile', async () => {
    fakeFMPService.getCompanyProfile = () => Promise.resolve(null as Profile);

    const defaultCompanyProfile: CompanyProfile = {
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
      industry: '',
      sector: '',
      country: '',
      isCustomProfile: false,
      id: 0,
    };
    jest.spyOn(fakeCompanyProfilesRepo, 'find').mockResolvedValue(null);
    jest
      .spyOn(fakeCompanyProfilesRepo, 'create')
      .mockResolvedValue(defaultCompanyProfile);

    const profile = await service.createNew(mockCreatePositionDtoOne.symbol);
    expect(profile.companyName).toEqual('custom profile required');
    expect(fakeCompanyProfilesRepo.create).toHaveBeenCalledTimes(1);
  });

  it('create should return a default profile', async () => {
    fakeFMPService.getCompanyProfile = () => Promise.resolve(null as Profile);

    const defaultCompanyProfile: CompanyProfile = {
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
      industry: '',
      sector: '',
      country: '',
      isCustomProfile: false,
      id: 0,
    };

    jest
      .spyOn(fakeCompanyProfilesRepo, 'find')
      .mockResolvedValue([defaultCompanyProfile]);
    jest.spyOn(fakeCompanyProfilesRepo, 'create');

    const profile = await service.createNew(mockCreatePositionDtoOne.symbol);
    expect(fakeCompanyProfilesRepo.create).toHaveBeenCalledTimes(0);
    expect(fakeCompanyProfilesRepo.find).toHaveBeenCalledTimes(1);
    expect(profile.companyName).toEqual('custom profile required');
  });

  it('create should create a new custom profile', async () => {
    const createCompanyProfileDto: CreateCompanyProfileDto = {
      symbol: 'custom',
      industry: 'industry',
      sector: 'sector',
      companyName: 'custom',
      price: 10,
      country: 'country',
      isCustomProfile: false,
    };
    const companyProfile = new CompanyProfile({
      ...createCompanyProfileDto,
      id: 1,
    });
    fakeCompanyProfilesRepo.create = () => {
      return Promise.resolve(companyProfile);
    };

    const profile = await service.createCustomCompanyProfile(
      createCompanyProfileDto,
    );

    expect(profile.symbol).toEqual('custom');
  });

  it('should return a default company profile', async () => {
    const expectedDefaultProfile: CompanyProfile = {
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
      sector: 'Default Sector',
      industry: 'Default Industry',
      id: 1,
      country: '',
      isCustomProfile: false,
    };

    fakeCompanyProfilesRepo.find = () => {
      return Promise.resolve(null);
    };
    fakeCompanyProfilesRepo.create = () => {
      return Promise.resolve(expectedDefaultProfile);
    };

    const defaultProfile = await service.getDefaultProfile();

    expect(defaultProfile).toBeDefined();
    expect(defaultProfile.sector).toEqual('Default Sector');
    expect(defaultProfile).toBeDefined();
  });

  const mockStockData: Profile[] = [
    {
      symbol: 'AAPL',
      price: 192.42,
      beta: 1.29,
      volAvg: 53885963,
      mktCap: 2975178798000,
      lastDiv: 0.96,
      range: '141.32-199.62',
      changes: -1.75,
      companyName: 'Apple Inc.',
      currency: 'USD',
      cik: '0000320193',
      isin: 'US0378331005',
      cusip: '037833100',
      exchange: 'NASDAQ Global Select',
      exchangeShortName: 'NASDAQ',
      industry: 'Consumer Electronics',
      website: 'https://www.apple.com',
      description:
        'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. In addition, the company offers various services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.',
      ceo: 'Mr. Timothy D. Cook',
      sector: 'Technology',
      country: 'US',
      fullTimeEmployees: '161000',
      phone: '408 996 1010',
      address: 'One Apple Park Way',
      city: 'Cupertino',
      state: 'CA',
      zip: '95014',
      dcfDiff: 49.62894,
      dcf: 142.7910607224458,
      image: 'https://financialmodelingprep.com/image-stock/AAPL.png',
      ipoDate: '1980-12-12',
      defaultImage: false,
      isEtf: false,
      isActivelyTrading: true,
      isAdr: false,
      isFund: false,
    },
  ];

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

  const mockCreatePositionDtoOne: CreatePositionDto = {
    symbol: 'AAPL',
    costPerShare: 100,
    quantity: 10,
    companyProfileId: 0,
    industryId: 0,
  };
});
