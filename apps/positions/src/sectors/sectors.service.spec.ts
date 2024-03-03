import { Test, TestingModule } from '@nestjs/testing';
import { SectorsService } from './sectors.service';
import { Sector } from './sector.entity';
import { SectorsRepository } from './sectors.repository';

describe('SectorsService', () => {
  let service: SectorsService;
  let fakeSectorsRepo: Partial<SectorsRepository>;
  beforeEach(async () => {
    fakeSectorsRepo = {
      getPositionQueryResult: () => {
        return Promise.resolve(sectorGroups);
      },
      create: () => {
        const sectorName = 'test sector';
        const testSector: Sector = {
          id: 1,
          sectorName: sectorName,
          industries: [],
        };

        return Promise.resolve(testSector);
      },
      find: () => {
        const sectorName = 'test sector';
        const testSector: Sector = {
          id: 1,
          sectorName: sectorName,
          industries: [],
        };

        return Promise.resolve([testSector]);
      },
      findOne: () => {
        const sectorName = 'test sector';
        const testSector: Sector = {
          id: 1,
          sectorName: sectorName,
          industries: [],
        };

        return Promise.resolve(testSector);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectorsService,
        {
          provide: SectorsRepository,
          useValue: fakeSectorsRepo,
        },
      ],
    }).compile();

    service = module.get<SectorsService>(SectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new sector', async () => {
    const sector = await service.create('test sector');

    expect(sector.sectorName).toEqual('test sector');
  });

  it('find should get a sector with sectorName "test sector"', async () => {
    const sectorName = 'test sector';

    const sector = await service.find('test sector');

    expect(sector.sectorName).toEqual(sectorName);
  });

  it('find should return null', async () => {
    fakeSectorsRepo.find = () => {
      return null;
    };

    const sector = await service.find('string');

    expect(sector).toBeNull();
  });
  it('findOne should return a sector', async () => {
    const sector = await service.findOne(1);

    expect(sector.id).toEqual(1);
  });

  it('should test your method', async () => {
    // Example of setting up a mock for createQueryBuilder
    // ...
  });

  // TODO: all group and mao sector methods

  const sectorGroups = [
    {
      sectorId: 1,
      sectorName: 'Technology',
      industryName: 'Software',
      currentValue: 1000,
      symbol: 'AAPL',
      positionId: 1,
      industryId: 1,
      totalCostBasis: 100,
      companyName: 'Apple Inc.',
    },
    {
      sectorId: 2,
      sectorName: 'Energy',
      industryName: 'Oil',
      currentValue: 100,
      symbol: 'BP',
      positionId: 2,
      industryId: 2,
      totalCostBasis: 100,
      companyName: 'BP',
    },
    {
      sectorId: 1,
      sectorName: 'Technology',
      industryName: 'Computers',
      currentValue: 100,
      symbol: 'MSFT',
      positionId: 3,
      industryId: 3,
      totalCostBasis: 100,
      companyName: 'Microsoft',
    },
    {
      sectorId: 1,
      sectorName: 'Technology',
      industryName: 'Software',
      currentValue: 1000,
      symbol: 'SOFT',
      positionId: 4,
      industryId: 1,
      totalCostBasis: 100,
      companyName: 'Software Inc.',
    },
  ];
});
