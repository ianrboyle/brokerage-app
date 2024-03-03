export class PortfolioSectors {
  [key: string]: PortfolioSector;
}

export class PortfolioSector {
  industries: { [key: string]: PortfolioIndustry };
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
}

export class PortfolioIndustry {
  currentValue: number;
  totalCostBasis: number;
  positions: { [key: string]: PortfolioPosition };
  percentGain: number;
}

export class PositionGroup {
  [key: string]: PortfolioPosition;
}

export class PortfolioPosition {
  companyName: string;
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
  quantity: number;
}

export enum GroupType {
  SECTOR,
  INDUSTRY,
  POSITION,
}

export interface GroupValuesFactory {
  createPortfolioPosition: () => PortfolioPosition;
  createPortfolioIndustry: () => PortfolioIndustry;
  createPortfolioSector: () => PortfolioSector;
}

export interface GroupValues {
  portfolioSector: PortfolioSector;
  portfolioIndustry: PortfolioIndustry;
  portfolioPosition: PortfolioPosition;
}
