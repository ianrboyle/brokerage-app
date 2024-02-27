import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position, User } from '@app/common';
import { CompanyProfilesProxy } from '../company-profiles.proxy';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';
import { FindOptionsWhere } from 'typeorm';
import {
  GroupValues,
  GroupValuesFactory,
  IndustryGroupValue,
  PositionGroupValue,
  PositionSqlQueryResult,
  SectorGroupValue,
  SectorGroups,
} from '../sectors/dtos/sector-dto';

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

  remove(id: number) {
    return this.positionsRepository.findOneAndDelete({ id });
  }

  async GetSome(userId: number) {
    return await this.positionsRepository.getSomePositions(userId);
  }

  async getPositionsBySector(userId: number) {
    const queryResult =
      await this.positionsRepository.getPositionsBySector(userId);
    const mappedQueryResult: PositionSqlQueryResult[] =
      this.mapPositionQueryResult(queryResult);

    const sectorGroups = this.mapSectorGroups(mappedQueryResult);

    return sectorGroups;
  }

  mapPositionQueryResult(queryResult: PositionSqlQueryResult[]) {
    return queryResult.map((r) => {
      return {
        sectorName: r.sectorName,
        sectorId: r.sectorId,
        industryName: r.industryName,
        currentValue: Number(r.currentValue),
        symbol: r.symbol,
        positionId: r.positionId,
        industryId: r.industryId,
        totalCostBasis: Number(r.totalCostBasis),
        companyName: r.companyName,
      };
    });
  }

  mapSectorGroups(result: PositionSqlQueryResult[]) {
    const sectorGroups: SectorGroups = {};
    const groupValuesFactory = this.createGroupValuesFactory();

    for (const position of result) {
      const { sectorGroupValue, industryGroupValue, positionGroupValue } =
        this.getGroupValues(sectorGroups, groupValuesFactory, position);

      this.updateGroupValues(
        sectorGroupValue,
        industryGroupValue,
        positionGroupValue,
        sectorGroups,
        position,
      );
    }

    this.calculateGroupsPercentGain(sectorGroups);

    return sectorGroups;
  }
  getGroupValues(
    sectorGroups: SectorGroups,
    groupValuesFactory: GroupValuesFactory,
    position: { sectorName: string; industryName: string; symbol: string },
  ): GroupValues {
    const { sectorName, industryName, symbol } = position;

    // Update or create sectorGroupValue
    sectorGroups[sectorName] =
      sectorGroups[sectorName] || groupValuesFactory.createSectorGroupValue();
    const sectorGroupValue = sectorGroups[sectorName];

    // Update or create industryGroupValue
    sectorGroupValue.industries[industryName] =
      sectorGroupValue.industries[industryName] ||
      groupValuesFactory.createIndustryGroupValue();
    const industryGroupValue = sectorGroupValue.industries[industryName];

    // Update or create positionGroupValue
    industryGroupValue.positions[symbol] =
      industryGroupValue.positions[symbol] ||
      groupValuesFactory.createPositionGroupValue();
    const positionGroupValue = industryGroupValue.positions[symbol];

    return {
      sectorGroupValue,
      industryGroupValue,
      positionGroupValue,
    };
  }
  updateGroupValues(
    sectorGroupValue: SectorGroupValue,
    industryGroupValue: IndustryGroupValue,
    positionGroupValue: PositionGroupValue,
    sectorGroups: SectorGroups,
    position: PositionSqlQueryResult,
  ) {
    const { sectorName, industryName, symbol } = position;

    industryGroupValue.positions[symbol] = this.updateGroupValue(
      positionGroupValue,
      position,
    ) as PositionGroupValue;

    sectorGroupValue.industries[industryName] = this.updateGroupValue(
      industryGroupValue,
      position,
    ) as IndustryGroupValue;

    sectorGroups[sectorName] = this.updateGroupValue(
      sectorGroupValue,
      position,
    ) as SectorGroupValue;
  }

  updateGroupValue(
    groupValue: SectorGroupValue | IndustryGroupValue | PositionGroupValue,
    position: PositionSqlQueryResult,
  ) {
    groupValue.currentValue += position.currentValue;
    groupValue.totalCostBasis += position.totalCostBasis;

    if ('companyName' in groupValue) {
      groupValue.companyName = position.companyName;
    }
    return groupValue;
  }

  calculateGroupsPercentGain(sectorGroups: SectorGroups) {
    for (const sectorName in sectorGroups) {
      const sectorGroupValue = sectorGroups[sectorName];
      this.calculatePercentGain(sectorGroupValue);

      for (const industryName in sectorGroupValue.industries) {
        const industryGroupValue = sectorGroupValue.industries[industryName];
        this.calculatePercentGain(industryGroupValue);

        for (const symbol in industryGroupValue.positions) {
          const positionGroupValue = industryGroupValue.positions[symbol];
          this.calculatePercentGain(positionGroupValue);
        }
      }
    }
  }

  calculatePercentGain(
    groupValue: SectorGroupValue | IndustryGroupValue | PositionGroupValue,
  ) {
    groupValue.percentGain =
      ((groupValue.currentValue - groupValue.totalCostBasis) /
        groupValue.totalCostBasis) *
      100;
  }

  createGroupValuesFactory = (): GroupValuesFactory => {
    return {
      createPositionGroupValue: () => ({
        currentValue: 0,
        companyName: '',
        totalCostBasis: 0,
        percentGain: 0,
      }),
      createIndustryGroupValue: () => ({
        positions: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
      }),
      createSectorGroupValue: () => ({
        industries: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
      }),
    };
  };
}
