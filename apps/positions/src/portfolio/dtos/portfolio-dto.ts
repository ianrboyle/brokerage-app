export type PortfolioSectors = {
  [key: string]: PortfolioSector;
};

export type PortfolioSector = {
  industries: { [key: string]: PortfolioIndustry };
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
};

export type PortfolioIndustry = {
  currentValue: number;
  totalCostBasis: number;
  positions: { [key: string]: PortfolioPosition };
  percentGain: number;
};

export type PositionGroup = {
  [key: string]: PortfolioPosition;
};

export type PortfolioPosition = {
  companyName: string;
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
  quantity: number;
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
