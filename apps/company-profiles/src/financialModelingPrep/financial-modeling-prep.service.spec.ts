import { Test, TestingModule } from '@nestjs/testing';

import { FinancialModelingPrepService } from './financial-modeling-prep.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Profile } from './models/profile';
import { of } from 'rxjs';

jest.mock('@nestjs/axios');

describe('FinancialModelingPrepService', () => {
  let service: FinancialModelingPrepService;
  let configServiceMock: Partial<ConfigService>;
  let httpServiceMock: Record<string, jest.Mock>;
  beforeEach(async () => {
    // configServiceMock = {
    //   get: jest.fn(),
    // };
    httpServiceMock = {
      get: jest.fn(),
    };
    configServiceMock = {
      get: () => {
        return 'fakeApiKey';
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        FinancialModelingPrepService,
        {
          provide: ConfigService,
          useValue: configServiceMock,
        },
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
      ],
    }).compile();

    service = module.get<FinancialModelingPrepService>(
      FinancialModelingPrepService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get company profile using mocked HttpService', async () => {
    const mockedProfile: Profile[] = mockStockData;
    httpServiceMock.get.mockReturnValue(of({ data: mockedProfile }) as any);
    const result = await service.getCompanyProfile('AAPL');

    expect(result).toEqual(mockedProfile[0]);

    expect(httpServiceMock.get).toHaveBeenCalledWith(
      `fakeApiKey/v3/profile/AAPL?apikey=fakeApiKey`,
    );
  });
  it('should get return profile with default sector and industry ', async () => {
    const mockedProfile: Profile[] = [
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
        industry: null,
        website: 'https://www.apple.com',
        description:
          'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. The company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. It also provides AppleCare support and cloud services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. In addition, the company offers various services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.',
        ceo: 'Mr. Timothy D. Cook',
        sector: '',
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
    const result = service.setDefaultValues(mockedProfile[0]);
    expect(result.sector).toEqual('Default Sector');
    expect(result.industry).toEqual('Default Industry');
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
});
