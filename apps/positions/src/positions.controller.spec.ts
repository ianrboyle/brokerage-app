import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  AUTH_SERVICE,
  COMPANY_PROFILES_SERVICE,
  Position,
} from '../../../libs/common/src';
import { ConfigService } from '@nestjs/config';

describe('PositionsController', () => {
  let controller: PositionsController;

  beforeEach(async () => {
    let fakePositionsService: Partial<PositionsService>;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Position),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
        {
          provide: COMPANY_PROFILES_SERVICE,
          useValue: {
            emit: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: AUTH_SERVICE,
          useValue: {
            emit: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: PositionsService,
          useValue: fakePositionsService,
        },
        ConfigService,
      ],
      controllers: [PositionsController],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
