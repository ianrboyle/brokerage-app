import { Test, TestingModule } from '@nestjs/testing';
import { SectorsService } from './sectors.service';
import { Sector } from './sector.entity';
import { SectorsRepository } from './sectors.repository';

describe('SectorsService', () => {
  let service: SectorsService;
  let fakeSectorsRepo: Partial<SectorsRepository>;
  beforeEach(async () => {
    fakeSectorsRepo = {
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
  it('findAll should return all sectors', async () => {
    const sectors = await service.findAll();

    expect(sectors).toBeDefined();
    expect(sectors.length > 0).toBeTruthy();
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
});
