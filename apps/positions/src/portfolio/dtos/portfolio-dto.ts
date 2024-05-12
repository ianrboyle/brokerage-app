export type PortfolioSectors = {
  [key: string]: PortfolioSector;
};

// export type PortfolioSector = {
//   industries: { [key: string]: PortfolioIndustry };
//   currentValue: number;
//   totalCostBasis: number;
//   percentGain: number;
//   percentOfAccount: number;
// };

// export type PortfolioIndustry = {
//   currentValue: number;
//   totalCostBasis: number;
//   positions: { [key: string]: PortfolioPosition };
//   percentGain: number;
//   industryName: string;
//   percentOfAccount: number;
// };

export type PositionGroup = {
  [key: string]: PortfolioPosition;
};

export type PortfolioPosition = {
  companyName: string;
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
  quantity: number;
  positionId: number;
};

export enum GroupType {
  SECTOR,
  INDUSTRY,
  POSITION,
}

export type GroupValuesFactory = {
  createPortfolioPosition: () => PortfolioPosition;
  createPortfolioIndustry: () => PortfolioIndustry;
  createPortfolioSector: () => PortfolioSector;
};

export type GroupValues = {
  portfolioSector: PortfolioSector;
  portfolioIndustry: PortfolioIndustry;
  portfolioPosition: PortfolioPosition;
};

export class PortfolioSectorsCalculator {
  private portfolioSectors: PortfolioSectors;

  constructor(portfolioSectors: PortfolioSectors) {
    this.portfolioSectors = portfolioSectors;
  }

  // Calculate total account value
  calculateTotalAccountValue(): number {
    let totalValue = 0;
    for (const sectorKey in this.portfolioSectors) {
      const sector = this.portfolioSectors[sectorKey];
      totalValue += sector.currentValue;
    }
    return totalValue;
  }
}
export class PortfolioIndustry {
  currentValue: number;
  totalCostBasis: number;
  positions: { [key: string]: PortfolioPosition };
  percentGain: number;
  industryName: string;
  percentOfAccount: number;
  industryId: number;

  constructor(
    currentValue: number,
    totalCostBasis: number,
    positions: { [key: string]: PortfolioPosition },
    percentGain: number,
    industryName: string,
    percentOfAccount: number = 0, // Default value for percentOfAccount
  ) {
    this.currentValue = currentValue;
    this.totalCostBasis = totalCostBasis;
    this.positions = positions;
    this.percentGain = percentGain;
    this.industryName = industryName;
    this.percentOfAccount = percentOfAccount;
  }
}

export class PortfolioSector {
  industries: { [key: string]: PortfolioIndustry };
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
  percentOfAccount: number;
  sectorId: number;
  sectorName: string;

  constructor(
    industries: { [key: string]: PortfolioIndustry },
    currentValue: number,
    totalCostBasis: number,
    percentGain: number,
    percentOfAccount: number = 0,
    sectorId: number,
    sectorName: string, // Default value for percentOfAccount
  ) {
    this.industries = industries;
    this.currentValue = currentValue;
    this.totalCostBasis = totalCostBasis;
    this.percentGain = percentGain;
    this.percentOfAccount = percentOfAccount;
    this.sectorId = sectorId;
    this.sectorName = sectorName;
  }

  static calculateSectorPercentOfAccount(
    portfolioSectors: PortfolioSectors,
  ): void {
    const calculator = new PortfolioSectorsCalculator(portfolioSectors);
    const totalAccountValue = calculator.calculateTotalAccountValue();
    for (const sectorName in portfolioSectors) {
      const sector = portfolioSectors[sectorName];
      sector.percentOfAccount = parseFloat(
        ((sector.currentValue / totalAccountValue) * 100).toFixed(2),
      );
      for (const industryName in sector.industries) {
        const industry = sector.industries[industryName];
        industry.percentOfAccount = parseFloat(
          ((industry.currentValue / totalAccountValue) * 100).toFixed(2),
        );
      }
    }
  }
}

// groupValue.percentGain = parseFloat(
//   (
//     ((groupValue.currentValue - groupValue.totalCostBasis) /
//       groupValue.totalCostBasis) *
//     100
//   ).toFixed(2),
