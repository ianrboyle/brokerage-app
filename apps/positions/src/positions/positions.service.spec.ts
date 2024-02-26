import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { PositionsRepository } from './positions.repository';
import { COMPANY_PROFILES_SERVICE, User } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { CreatePositionDto } from '../dto/create-position.dto';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';
import { Sector } from '../sectors/sector.entity';
import { Industry } from '../industries/industries.entity';

describe('PositionsService', () => {
  let service: PositionsService;
  let fakePositionsRepo: Partial<PositionsRepository>;
  let fakeCompanyProfilesServiceProxy: Partial<CompanyProfilesProxy>;
  let fakeSectorsService: Partial<SectorsService>;
  let fakeIndustriesService: Partial<IndustriesService>;
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

    fakeSectorsService = {
      getOrCreateSector: () => {
        const sector: Sector = {
          sectorName: 'test sector',
          industries: [],
          id: 1,
        };

        return Promise.resolve(sector);
      },
    };
    fakeIndustriesService = {
      getOrCreateIndustry: () => {
        const sector: Sector = {
          sectorName: 'test sector',
          industries: [],
          id: 1,
        };

        const industry: Industry = {
          industryName: '',
          sector: sector,
          id: 0,
        };

        return Promise.resolve(industry);
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
        {
          provide: SectorsService,
          useValue: fakeSectorsService,
        },
        {
          provide: IndustriesService,
          useValue: fakeIndustriesService,
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
