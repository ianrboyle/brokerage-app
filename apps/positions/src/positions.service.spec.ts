import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { PositionsRepository } from './positions.repository';
import { COMPANY_PROFILES_SERVICE, User } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompanyProfilesProxy } from './company-profiles.proxy';
import { CreatePositionDto } from './dto/create-position.dto';

describe('PositionsService', () => {
  let service: PositionsService;
  let fakePositionsRepo: Partial<PositionsRepository>;
  let fakeCompanyProfilesServiceProxy: Partial<CompanyProfilesProxy>;
  beforeEach(async () => {
    fakePositionsRepo = {
      create: () => {
        return Promise.resolve({
          id: 1,
          symbol: 'TEST',
          quantity: 10,
          costPerShare: 100,
          user: mockUserOne,
          industryId: 1,
          companyProfileId: 1234,
        });
      },
    };

    fakeCompanyProfilesServiceProxy = {
      getOrCreateCompanyProfile: () => {
        return Promise.resolve(fakeCompanyProfile);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        // Import the necessary modules
        ClientsModule.registerAsync([
          {
            name: COMPANY_PROFILES_SERVICE,
            useFactory: () => ({
              transport: Transport.TCP,
              options: {
                host: 'your-host',
                port: 1234, // Replace with your actual port
              },
            }),
          },
        ]),
      ],
      providers: [
        PositionsService,
        {
          provide: PositionsRepository,
          useValue: fakePositionsRepo,
        },
        {
          provide: CompanyProfilesProxy,
          useValue: fakeCompanyProfilesServiceProxy,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a positions', async () => {
    const createPositionDto: CreatePositionDto = {
      symbol: 'TEST',
      quantity: 0,
      costPerShare: 0,
      companyProfileId: 0,
      industryId: 0,
    };

    const position = await service.create(createPositionDto, mockUserOne);
    expect(position.companyProfileId).toEqual(fakeCompanyProfile.id);
    expect(position.user).toEqual(mockUserOne);
  });

  const mockUserOne: User = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    positions: [],
  };

  const fakeCompanyProfile = {
    id: 1234,
    symbol: 'TEST',
    price: 150.5,
    companyName: '',
    industry: '',
    sector: '',
    country: '',
    isCustomProfile: false,
  };
});
