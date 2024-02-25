import { Inject, Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position } from './entities/position.entity';
import { ClientProxy } from '@nestjs/microservices';
import { COMPANY_PROFILES_SERVICE, CompanyProfile } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    @Inject(COMPANY_PROFILES_SERVICE)
    private readonly companyProfilesService: ClientProxy,
  ) {}
  async create(createPositionDto: CreatePositionDto, userId: number) {
    const profile = await this.getOrCreateCompanyProfile(
      createPositionDto.symbol,
    );
    const position = new Position({
      ...createPositionDto,
    });
    position.userId = userId;
    position.companyProfileId = profile.id;
    position.industryId = 1;
    return await this.positionsRepository.create(position);
  }

  findAll() {
    return this.positionsRepository.find({});
  }

  findOne(id: number) {
    return this.positionsRepository.findOne({ id });
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.positionsRepository.findOneAndUpdate({ id }, updatePositionDto);
  }

  remove(id: number) {
    return this.positionsRepository.findOneAndDelete({ id });
  }

  private async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const getProfileResponse = this.companyProfilesService.send(
      'get_profile',
      symbol,
    );

    return await firstValueFrom<CompanyProfile>(getProfileResponse);
  }

  private async createCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const createProfileResponse = this.companyProfilesService.send(
      'create_new_profile',
      symbol,
    );

    return await firstValueFrom<CompanyProfile>(createProfileResponse);
  }

  private async getOrCreateCompanyProfile(symbol: string) {
    const profile = await this.getCompanyProfile(symbol);
    if (!profile) {
      return await this.createCompanyProfile(symbol);
    }

    return profile;
  }
}
