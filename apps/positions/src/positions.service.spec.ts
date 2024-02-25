import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { PositionsRepository } from './positions.repository';
import { COMPANY_PROFILES_SERVICE, Position, User } from '@app/common';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

describe('PositionsService', () => {
  let service: PositionsService;
  let fakePositionsRepo: Partial<PositionsRepository>;
  let fakeCompanyProfilesServiceClientProxy: Partial<ClientProxy>;
  beforeEach(async () => {
    fakePositionsRepo = {
      create: () => {
        return Promise.resolve({
          id: 1,
          symbol: 'AAPL',
          quantity: 10,
          costPerShare: 100,
          user: mockUserOne,
          industryId: 1,
          companyProfileId: 1,
        });
      },
    };

    fakeCompanyProfilesServiceClientProxy = {
      send: () => {
        return of(fakeCompanyProfile) as Observable<any>;
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
          provide: ClientProxy,
          useValue: fakeCompanyProfilesServiceClientProxy,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new companyProfile', async () => {
    fakeCompanyProfilesServiceClientProxy.send = () => {
      return of(fakeCompanyProfile) as Observable<any>;

      const profile = service.createCompanyProfile('AAPL');
    };
  });
  const mockUserOne: User = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    positions: [],
  };
  const mockPosition1: Position = {
    id: 1,
    symbol: 'AAPL',
    quantity: 10,
    costPerShare: 100,
    user: mockUserOne,
    industryId: 1,
    companyProfileId: 1,
  };

  const fakeCompanyProfile = {
    id: 1,
    symbol: 'AAPL',
    price: 150.5,
    companyName: '',
    industry: '',
    sector: '',
    country: '',
    isCustomProfile: false,
  };
});
