import { Test, TestingModule } from '@nestjs/testing';

import { FinancialModelingPrepService } from './financial-modeling-prep.service';
import { ConfigService } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Profile } from './models/profile';
import { mockStockData } from '../mock-data/mock-profile-data';
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
      `https://financialmodelingprep.com/api/v3/profile/AAPL?apikey=fakeApiKey`,
    );
  });
});
