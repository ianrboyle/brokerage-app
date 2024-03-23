import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SectorsController } from './sectors.controller';
import { SectorsService } from './sectors.service';
import { Sector } from './sector.entity';

describe('SectorsController', () => {
  let controller: SectorsController;

  beforeEach(async () => {
    let fakeSectorsService: Partial<SectorsService>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Sector),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: SectorsService,
          useValue: fakeSectorsService,
        },
        ConfigService,
      ],
      controllers: [SectorsController],
    }).compile();

    controller = module.get<SectorsController>(SectorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
