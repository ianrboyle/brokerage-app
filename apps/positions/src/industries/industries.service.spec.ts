import { Test, TestingModule } from '@nestjs/testing';

import { IndustriesService } from './industries.service';
import { Industry } from './industries.entity';
import { Sector } from '../sectors/sector.entity';
import { IndustriesRepository } from './industries.repository';

describe('IndustriesService', () => {
  let service: IndustriesService;
  let fakeIndustriesRepo: Partial<IndustriesRepository>;

  beforeEach(async () => {
    fakeIndustriesRepo = {
      create: () => {
        const industryName = 'test industry';
        const testSector: Sector = {
          id: 1,
          sectorName: 'test sector',
          industries: [],
        };
        const testIndustry: Industry = {
          id: 1,
          industryName: industryName,
          sector: testSector,
        };
        return Promise.resolve(testIndustry);
      },
      find: () => {
        const industryName = 'test industry';
        const testSector: Sector = {
          id: 1,
          sectorName: 'test sector',
          industries: [],
        };
        const testIndustry: Industry = {
          id: 1,
          industryName: industryName,
          sector: testSector,
        };
        return Promise.resolve([testIndustry]);
      },
      findOne: () => {
        const industryName = 'test industry';
        const testSector: Sector = {
          id: 1,
          sectorName: 'test sector',
          industries: [],
        };
        const testIndustry: Industry = {
          id: 1,
          industryName: industryName,
          sector: testSector,
        };
        return Promise.resolve(testIndustry);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IndustriesService,
        {
          provide: IndustriesRepository,
          useValue: fakeIndustriesRepo,
        },
      ],
    }).compile();

    service = module.get<IndustriesService>(IndustriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new industry', async () => {
    const industryName = 'test industry';
    const testSector: Sector = {
      id: 1,
      sectorName: 'test sector',
      industries: [],
    };
    const testIndustry: Industry = {
      id: 1,
      industryName: industryName,
      sector: testSector,
    };

    const industry = await service.create(industryName, testSector);

    expect(industry.sector.sectorName).toEqual(testSector.sectorName);
    expect(industry.industryName).toEqual(testIndustry.industryName);
  });

  it('find should get a industry with industryName "test industry"', async () => {
    const industryName = 'test industry';

    const industry = await service.find('test industry');

    expect(industry.industryName).toEqual(industryName);
  });

  it('find should return null', async () => {
    fakeIndustriesRepo.find = () => {
      return Promise.resolve([]);
    };

    const industry = await service.find('string');

    expect(industry).toBeNull();
  });
  it('findOne should return a industry', async () => {
    const industry = await service.findOne(1);

    expect(industry.id).toEqual(1);
  });
});
