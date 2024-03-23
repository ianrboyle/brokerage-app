import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { PositionsRepository } from './positions.repository';
import { COMPANY_PROFILES_SERVICE, User } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { CreatePositionDto } from './dtos/create-position.dto';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';
import { Sector } from '../sectors/sector.entity';
import { Industry } from '../industries/industries.entity';
import { PortfolioService } from '../portfolio/portfolio.service';
import { PositionSqlQueryResult } from './dtos/position-sector-sql-query-result.dto';
import { UpdatePositionIndustryDto } from './dtos/update-position-industry.dto';

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
      createMultiple: () => {
        const positions = [
          {
            id: 1,
            symbol: 'TEST1',
            quantity: 10,
            costPerShare: 100,
            user: mockUserOne,
            industryId: 1,
            companyProfileId: 1234,
          },
          {
            id: 2,
            symbol: 'TEST2',
            quantity: 10,
            costPerShare: 100,
            user: mockUserOne,
            industryId: 1,
            companyProfileId: 1234,
          },
        ];
        return Promise.resolve(positions);
      },
      getPositionsBySector: () => {
        return Promise.resolve(getMockPositionSqlQueryResult());
      },

      findOneAndUpdate: () => {
        return Promise.resolve({
          id: 2,
          symbol: 'TEST2',
          quantity: 10,
          costPerShare: 100,
          user: mockUserOne,
          industryId: 123456,
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
        PortfolioService,
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

  it('should get positions by sector', async () => {
    const portfolioSectors = await service.getPositionPortfolioSectors(1);

    expect(portfolioSectors).toBeDefined();
    for (const sectorName in portfolioSectors) {
      const sector = portfolioSectors[sectorName];
      expect(sector).toBeDefined();
      expect(sector.currentValue).toBeDefined();
      expect(sector.industries).toBeDefined();
      for (const industryName in sector.industries) {
        const industry = sector.industries[industryName];
        expect(industry).toBeDefined();
        const positions = industry.positions;
        expect(positions).toBeDefined();
        for (const symbol in positions) {
          const position = positions[symbol];
          expect(position).toBeDefined();
        }
      }
    }
  });

  it('should insert multiple positions', async () => {
    //TODO
    const positionDtos = [mockCreatePositionDtoOne, mockCreatePositionDtoTwo];
    const positions = service.insertMultiple(positionDtos, mockUserOne);
    expect(positions).toBeDefined();
  });

  it('should update a positions industry', async () => {
    //TODO
    const positionId = 2;
    const newIndustryId = 123456;
    const industryDto: UpdatePositionIndustryDto = {
      industryId: newIndustryId,
    };

    const updatedPosition = service.updatePositionIndustry(
      positionId,
      industryDto,
    );
    expect(updatedPosition).toBeDefined();
    // DOES THIS REALLY TEST ANYTHING?
    expect((await updatedPosition).industryId).toEqual(newIndustryId);
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

  const getMockPositionSqlQueryResult = (): PositionSqlQueryResult[] => {
    return [
      {
        sectorId: 1,
        sectorName: 'Technology',
        industryName: 'Software',
        symbol: 'AAPL',
        currentValue: 100,
        positionId: 101,
        industryId: 1,
        totalCostBasis: 10,
        companyName: 'Apple Inc.',
        quantity: 10,
        percentGain: 900.0,
      },
      {
        sectorId: 2,
        sectorName: 'Finance',
        industryName: 'Banking',
        symbol: 'JPM',
        currentValue: 10,
        positionId: 102,
        industryId: 3,
        totalCostBasis: 5,
        companyName: 'JPMorgan Chase & Co.',
        quantity: 2,
        percentGain: 100,
      },
      {
        sectorId: 1,
        sectorName: 'Technology',
        industryName: 'Computers',
        symbol: 'MSFT',
        currentValue: 50,
        positionId: 103,
        industryId: 2,
        totalCostBasis: 100,
        companyName: 'Microsoft.',
        quantity: 2,
        percentGain: -50,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry one',
        symbol: 'TEST1',
        currentValue: 10,
        positionId: 104,
        industryId: 101,
        totalCostBasis: 5,
        companyName: 'Test company.',
        quantity: 1,
        percentGain: 100,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry two',
        symbol: 'TEST2',
        currentValue: 10,
        positionId: 105,
        industryId: 102,
        totalCostBasis: 7,
        companyName: 'TEST2.',
        quantity: 2,
        percentGain: 42.86,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry two',
        symbol: 'TEST3',
        currentValue: 10,
        positionId: 106,
        industryId: 102,
        totalCostBasis: 15,
        companyName: 'TEST3.',
        quantity: 3,
        percentGain: -33.33,
      },
      // Add more dummy data as needed
    ];
  };

  const mockCreatePositionDtoOne: CreatePositionDto = {
    symbol: 'TEST1',
    costPerShare: 100,
    quantity: 10,
    companyProfileId: 0,
    industryId: 0,
  };
  const mockCreatePositionDtoTwo: CreatePositionDto = {
    symbol: 'TEST2',
    costPerShare: 200.5,
    quantity: 25,
    companyProfileId: 0,
    industryId: 0,
  };
});
