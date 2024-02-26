import { Injectable } from '@nestjs/common';

import { Sector } from './sector.entity';
import {
  GroupValues,
  GroupValuesFactory,
  IndustryGroupValue,
  PositionGroupValue,
  PositionSqlQueryResult,
  SectorGroupValue,
  SectorGroups,
} from './dtos/sector-dto';
import { SectorsRepository } from './sectors.repository';

@Injectable()
export class SectorsService {
  constructor(private readonly sectorsRepository: SectorsRepository) {}

  create(sectorName: string) {
    const sector = new Sector({ sectorName: sectorName });
    return this.sectorsRepository.create(sector);
  }

  async findOne(id: number) {
    return await this.sectorsRepository.findOne({ id });
  }

  async find(sectorName: string) {
    const sectors = await this.sectorsRepository.find({ sectorName });

    return !sectors || sectors.length <= 0 ? null : sectors[0];
  }

  async getOrCreateSector(sectorName: string) {
    const sector = await this.find(sectorName);

    if (!sector) {
      return await this.create(sectorName);
    }
    return sector;
  }

  async getUserSectors(userId: number) {
    const result = await this.sectorsRepository.getPositionQueryResult(userId);

    const mappedQueryResult: PositionSqlQueryResult[] =
      this.mapPositionQueryResult(result);

    const sectorGroups = this.mapSectorGroups(mappedQueryResult);

    return sectorGroups;
  }

  async update(id: number, attrs: Partial<Sector>) {
    return this.sectorsRepository.findOneAndUpdate({ id }, attrs);
  }

  async remove(id: number) {
    return this.sectorsRepository.findOneAndDelete({ id });
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

  mapPositionQueryResult(result: PositionSqlQueryResult[]) {
    return result.map((r) => {
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
}
