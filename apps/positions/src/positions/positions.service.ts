import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position, User } from '@app/common';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly companyProfilesProxy: CompanyProfilesProxy,
    private readonly sectorsService: SectorsService,
    private readonly industriesService: IndustriesService,
  ) {}
  async create(createPositionDto: CreatePositionDto, user: User) {
    const profile = await this.companyProfilesProxy.getOrCreateCompanyProfile(
      createPositionDto.symbol,
    );

    const sector = await this.sectorsService.getOrCreateSector(profile.sector);
    const industry = await this.industriesService.getOrCreateIndustry(
      profile.industry,
      sector,
    );

    createPositionDto.companyProfileId = profile.id;
    createPositionDto.industryId = industry.id;

    const position = new Position({
      ...createPositionDto,
    });
    position.user = user;
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
}
