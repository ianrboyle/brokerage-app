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
import { PositionSqlQueryResult } from './dtos/position-sector-sql-query-result.dto';
import { PositionDto } from './dtos/position-dto';
// import { PositionDto } from './dtos/position-dto';

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
      const position = await this.setPositionDtoValues(
        positionDto,
        user,
        positionDto.lastPrice,
      );
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

  async getPositionsWhereCostEqualsZero(userId: number) {
    const queryResult =
      await this.positionsRepository.getPositionsBySector(userId);
    console.log('QUERY!!!!!!', queryResult);
    const filteredQuery = queryResult.filter(
      (p) => Number(p.totalCostBasis) == 0,
    );
    console.log('filteredQuery!!!!!', filteredQuery);

    const filteredPositions: PositionDto[] = [];
    filteredQuery.forEach((p) => {
      p.costPerShare = 0;
      const mappedPosition = this.mapPositionDto(p);
      filteredPositions.push(mappedPosition);
    });
    return filteredPositions;
  }
  async findOne(positionId: number, userId: number) {
    const positionQueryResult = await this.positionsRepository.getPositionById(
      positionId,
      userId,
    );
    // return positionQueryResult;
    return this.mapPositionDto(positionQueryResult);
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
    lastPrice?: number,
  ) {
    let profile = await this.companyProfilesProxy.getOrCreateCompanyProfile(
      positionDto.symbol,
    );
    if (lastPrice && lastPrice > 0) {
      profile.price = lastPrice;
      profile = await this.companyProfilesProxy.updateCompanyProfile(
        profile.id,
        profile,
      );
    }
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

  private mapPositionDto(position: PositionSqlQueryResult): PositionDto {
    let percentGain = 0;
    if (Number(position.costPerShare) != 0) {
      const totalCostBasis =
        Number(position.quantity) * Number(position.costPerShare);
      percentGain =
        ((Number(position.currentValue) - totalCostBasis) / totalCostBasis) *
        100;
    }

    const mappedPosition: PositionDto = {
      id: position.positionId,
      symbol: position.symbol,
      quantity: Number(position.quantity),
      costPerShare: Number(position.costPerShare),
      industryId: position.industryId,
      industryName: position.industryName,
      sectorId: position.sectorId,
      sectorName: position.sectorName,
      percentGain: Number(percentGain),
      totalCostBasis: Number(position.totalCostBasis),
      companyName: position.companyName,
      currentValue: Number(position.currentValue),
    };
    return mappedPosition;
  }
}
