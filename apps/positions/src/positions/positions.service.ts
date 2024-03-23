import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position, User } from '@app/common';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';
import { FindOptionsWhere } from 'typeorm';
import { PortfolioService } from '../portfolio/portfolio.service';
import { PortfolioSectors } from '../portfolio/dtos/portfolio-dto';
import { UpdatePositionIndustryDto } from './dtos/update-position-industry.dto';

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly companyProfilesProxy: CompanyProfilesProxy,
    private readonly sectorsService: SectorsService,
    private readonly industriesService: IndustriesService,
    private readonly portfolioService: PortfolioService,
  ) {}
  async create(positionDto: CreatePositionDto, user: User) {
    const position = await this.setPositionDtoValues(positionDto, user);
    return await this.positionsRepository.create(position);
  }

  async insertMultiple(positionDtos: CreatePositionDto[], user: User) {
    const positions: Position[] = [];
    for (const positionDto of positionDtos) {
      const position = await this.setPositionDtoValues(positionDto, user);
      positions.push(position);
    }
    return await this.positionsRepository.createMultiple(positions);
  }

  findAll() {
    return this.positionsRepository.find({});
  }

  async getUserPositions(userId: number) {
    const whereClause: FindOptionsWhere<Position> = { user: { id: userId } };
    return await this.positionsRepository.find(whereClause);
  }

  findOne(id: number) {
    return this.positionsRepository.findOne({ id });
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.positionsRepository.findOneAndUpdate({ id }, updatePositionDto);
  }

  updatePositionIndustry(
    id: number,
    updatePositionIndustryDto: UpdatePositionIndustryDto,
  ) {
    return this.positionsRepository.findOneAndUpdate(
      { id },
      updatePositionIndustryDto,
    );
  }

  remove(id: number) {
    return this.positionsRepository.findOneAndDelete({ id });
  }

  async getPositionPortfolioSectors(userId: number) {
    const queryResult =
      await this.positionsRepository.getPositionsBySector(userId);

    const portfolioSectors: PortfolioSectors =
      this.portfolioService.mapPortfolioSectors(queryResult);

    return portfolioSectors;
  }

  private async setPositionDtoValues(
    positionDto: CreatePositionDto,
    user: User,
  ) {
    const profile = await this.companyProfilesProxy.getOrCreateCompanyProfile(
      positionDto.symbol,
    );

    const sector = await this.sectorsService.getOrCreateSector(profile.sector);
    const industry = await this.industriesService.getOrCreateIndustry(
      profile.industry,
      sector,
    );
    return new Position({
      ...positionDto,
      user: user,
      companyProfileId: profile.id,
      industryId: industry.id,
    });
  }
}
