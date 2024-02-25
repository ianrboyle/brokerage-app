import { HttpService } from '@nestjs/axios';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Profile } from './models/profile';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FinancialModelingPrepService {
  private readonly apiKey: string;
  private readonly apiUri: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>(
      'FINANCIAL_MODELING_PREP_API_KEY',
    );
    this.apiUri = this.configService.get<string>('FINANCIAL_MODELING_PREP_URI');
  }

  getCompanyProfile = async (symbol: string): Promise<Profile> => {
    const { data } = await firstValueFrom(
      this.httpService
        .get<
          Profile[]
        >(`${this.apiUri}/v3/profile/${symbol}?apikey=${this.apiKey}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new ServiceUnavailableException(
              `Error fetching company profile from FinancialModelingPrep for symbol: ${symbol}. Error Response: ${JSON.stringify(
                error.response.data,
              )}`,
            );
          }),
        ),
    );
    if (!data || data.length <= 0) return null;

    return this.setDefaultValues(data[0]);
  };

  setDefaultValues(profile: Profile) {
    profile.sector =
      profile.sector === '' || !profile.sector
        ? 'Default Sector'
        : profile.sector;
    profile.industry =
      profile.industry === '' || !profile.industry
        ? 'Default Industry'
        : profile.industry;
    return profile;
  }
}
