import { Injectable } from '@nestjs/common';
import { PositionSqlQueryResult } from '../positions/dtos/position-sector-sql-query-result.dto';
import {
  GroupValues,
  GroupValuesFactory,
  PortfolioIndustry,
  PortfolioPosition,
  PortfolioSector,
  PortfolioSectors,
} from '../portfolio/dtos/portfolio-dto';

@Injectable()
export class PortfolioService {
  constructor() {}

  public mapPortfolioSectors(result: PositionSqlQueryResult[]) {
    const portfolioSectors: PortfolioSectors = {};
    const groupValuesFactory = this.createGroupValuesFactory();

    let accountValue = 0;
    for (const position of result) {
      accountValue += Number(position.currentValue);
      const { portfolioSector, portfolioIndustry, portfolioPosition } =
        this.createGroupValues(portfolioSectors, groupValuesFactory, position);

      this.updateGroupValues(
        portfolioSector,
        portfolioIndustry,
        portfolioPosition,
        portfolioSectors,
        position,
      );
    }

    this.calculatePercentOfAccount(portfolioSectors, accountValue);
    return portfolioSectors;
  }
  createGroupValues(
    portfolioSectors: PortfolioSectors,
    groupValuesFactory: GroupValuesFactory,
    position: { sectorName: string; industryName: string; symbol: string },
  ): GroupValues {
    const { sectorName, industryName, symbol } = position;

    // Update or create portfolioSector
    portfolioSectors[sectorName] =
      portfolioSectors[sectorName] ||
      groupValuesFactory.createPortfolioSector();
    const portfolioSector = portfolioSectors[sectorName];

    // Update or create industryGroupValue
    portfolioSector.industries[industryName] =
      portfolioSector.industries[industryName] ||
      groupValuesFactory.createPortfolioIndustry();
    const portfolioIndustry = portfolioSector.industries[industryName];

    // Update or create portfolioPosition
    portfolioIndustry.positions[symbol] =
      portfolioIndustry.positions[symbol] ||
      groupValuesFactory.createPortfolioPosition();
    const portfolioPosition = portfolioIndustry.positions[symbol];

    return {
      portfolioSector,
      portfolioIndustry,
      portfolioPosition,
    };
  }
  updateGroupValues(
    portfolioSector: PortfolioSector,
    portfolioIndustry: PortfolioIndustry,
    portfolioPosition: PortfolioPosition,
    portfolioSectors: PortfolioSectors,
    position: PositionSqlQueryResult,
  ) {
    const { sectorName, industryName, symbol } = position;

    portfolioIndustry.positions[symbol] = this.updateGroupValue(
      portfolioPosition,
      position,
    ) as PortfolioPosition;

    portfolioSector.industries[industryName] = this.updateGroupValue(
      portfolioIndustry,
      position,
    ) as PortfolioIndustry;

    portfolioSectors[sectorName] = this.updateGroupValue(
      portfolioSector,
      position,
    ) as PortfolioSector;
  }

  updateGroupValue(
    groupValue: PortfolioSector | PortfolioIndustry | PortfolioPosition,
    position: PositionSqlQueryResult,
  ): PortfolioSector | PortfolioIndustry | PortfolioPosition {
    groupValue.currentValue += Number(position.currentValue);
    groupValue.totalCostBasis += Number(position.totalCostBasis);
    if (!('companyName' in groupValue)) {
      this.calculatePercentGain(groupValue);
    }
    if ('companyName' in groupValue) {
      groupValue.companyName = position.companyName;
      groupValue.percentGain = Number(position.percentGain);
      groupValue.quantity = Number(position.quantity);
    }
    return groupValue;
  }

  calculatePercentOfAccount(
    portfolioSectors: PortfolioSectors,
    accountValue: number,
  ) {
    for (const sectorName in portfolioSectors) {
      const sector = portfolioSectors[sectorName];
      sector.percentOfAccount = (sector.currentValue / accountValue) * 100;
    }
  }

  calculatePercentGain(
    groupValue: PortfolioSector | PortfolioIndustry | PortfolioPosition,
  ) {
    groupValue.percentGain =
      ((groupValue.currentValue - groupValue.totalCostBasis) /
        groupValue.totalCostBasis) *
      100;
  }

  createGroupValuesFactory = (): GroupValuesFactory => {
    return {
      createPortfolioPosition: () => ({
        currentValue: 0,
        companyName: '',
        totalCostBasis: 0,
        percentGain: 0,
        quantity: 0,
      }),
      createPortfolioIndustry: () => ({
        positions: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
      }),
      createPortfolioSector: () => ({
        industries: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
        percentOfAccount: 0,
      }),
    };
  };
}
