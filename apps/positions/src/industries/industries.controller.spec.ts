import { Test, TestingModule } from '@nestjs/testing';

import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { IndustriesController } from './industries.controller';
import { IndustriesService } from './industries.service';
import { Industry } from './industries.entity';

describe('IndustriesController', () => {
  let controller: IndustriesController;

  beforeEach(async () => {
    let fakeIndustriesService: Partial<IndustriesService>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Industry),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: IndustriesService,
          useValue: fakeIndustriesService,
        },
        ConfigService,
      ],
      controllers: [IndustriesController],
    }).compile();

    controller = module.get<IndustriesController>(IndustriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
