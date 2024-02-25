import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesProxy } from './company-profiles.proxy';
import { COMPANY_PROFILES_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, of } from 'rxjs';

describe('CompanyProfilesProxy', () => {
  let companyProfilesProxy: CompanyProfilesProxy;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyProfilesProxy,
        {
          provide: COMPANY_PROFILES_SERVICE,
          useValue: {
            emit: jest.fn(),
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    companyProfilesProxy = app.get<CompanyProfilesProxy>(CompanyProfilesProxy);
    clientProxyMock = app.get<ClientProxy>(COMPANY_PROFILES_SERVICE);
  });

  it('should be defined', () => {
    expect(companyProfilesProxy).toBeDefined();
  });

  describe('getOrCreateCompanyProfile', () => {
    it('should return existing company profile', async () => {
      const mockSymbol = 'AAPL';
      const mockProfile = fakeCompanyProfile;
      clientProxyMock.send = () => {
        return of(fakeCompanyProfile) as Observable<any>;
      };

      const result =
        await companyProfilesProxy.getOrCreateCompanyProfile(mockSymbol);

      expect(result).toEqual(mockProfile);
    });
  });

  it('should return existing company profile', async () => {
    const mockSymbol = 'AAPL';
    const mockProfile = fakeCompanyProfile;

    // Mock the response of getCompanyProfile method
    (clientProxyMock.send as jest.Mock).mockReturnValueOnce(of(mockProfile));

    const result =
      await companyProfilesProxy.getOrCreateCompanyProfile(mockSymbol);

    expect(result).toEqual(mockProfile);

    // Check that send was called with the correct arguments for getCompanyProfile
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      'get_profile',
      mockSymbol,
    );
    expect(clientProxyMock.send).not.toHaveBeenCalledWith(
      'create_new_profile',
      mockSymbol,
    );
  });
  it('should create and return a new company profile if it does not exist', async () => {
    const mockSymbol = 'AAPL';
    const mockNewProfile = fakeCompanyProfile;

    // Mock the response of getCompanyProfile method to return null
    (clientProxyMock.send as jest.Mock).mockReturnValueOnce(of(null));

    // Mock the response of createCompanyProfile method
    (clientProxyMock.send as jest.Mock).mockReturnValueOnce(of(mockNewProfile));

    const result =
      await companyProfilesProxy.getOrCreateCompanyProfile(mockSymbol);

    expect(result).toEqual(mockNewProfile);
    expect(result.symbol).toEqual('AAPL');

    // Check that send was called with the correct arguments for createCompanyProfile
    expect(clientProxyMock.send).toHaveBeenCalledWith(
      'create_new_profile',
      mockSymbol,
    );
  });

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
