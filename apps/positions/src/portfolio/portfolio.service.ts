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

    for (const position of result) {
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

    PortfolioSector.calculateSectorPercentOfAccount(portfolioSectors);
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
    portfolioSector.industries[industryName].industryName = industryName;

    portfolioSectors[sectorName] = this.updateGroupValue(
      portfolioSector,
      position,
    ) as PortfolioSector;
    portfolioSector.sectorName = sectorName;
  }

  updateGroupValue(
    groupValue: PortfolioSector | PortfolioIndustry | PortfolioPosition,
    position: PositionSqlQueryResult,
  ): PortfolioSector | PortfolioIndustry | PortfolioPosition {
    groupValue.currentValue += Number(position.currentValue);
    groupValue.totalCostBasis += Number(position.totalCostBasis);
    // if (!('companyName' in groupValue)) {
    //   this.calculatePercentGain(groupValue);
    // }
    this.calculatePercentGain(groupValue);
    if ('sectorId' in groupValue) {
      groupValue.sectorId = position.sectorId;
    }
    if ('industryId' in groupValue) {
      groupValue.industryId = position.industryId;
    }
    if ('companyName' in groupValue) {
      groupValue.companyName = position.companyName;
      // groupValue.percentGain = Number(position.percentGain);
      groupValue.quantity = Number(position.quantity);
      groupValue.positionId = position.positionId;
    }
    return groupValue;
  }

  calculatePercentGain(
    groupValue: PortfolioSector | PortfolioIndustry | PortfolioPosition,
  ) {
    if (groupValue.totalCostBasis != 0) {
      groupValue.percentGain = parseFloat(
        (
          ((groupValue.currentValue - groupValue.totalCostBasis) /
            groupValue.totalCostBasis) *
          100
        ).toFixed(2),
      );
    } else {
      groupValue.percentGain = 1;
    }
  }

  createGroupValuesFactory = (): GroupValuesFactory => {
    return {
      createPortfolioPosition: () => ({
        currentValue: 0,
        companyName: '',
        totalCostBasis: 0,
        percentGain: 0,
        quantity: 0,
        positionId: 0,
      }),
      createPortfolioIndustry: () => ({
        positions: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
        industryName: '',
        percentOfAccount: 0,
        industryId: 0,
      }),
      createPortfolioSector: () => ({
        industries: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
        percentOfAccount: 0,
        sectorId: 0,
        sectorName: '',
      }),
    };
  };
}
