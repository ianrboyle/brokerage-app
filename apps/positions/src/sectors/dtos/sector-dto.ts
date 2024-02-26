export class PositionSqlQueryResult {
  sectorId: number;
  sectorName: string;
  industryName: string;
  symbol: string;
  currentValue: number;
  positionId: number;
  industryId: number;
  totalCostBasis: number;
  companyName: string;
}

export class SectorGroups {
  [key: string]: SectorGroupValue;
}

export class SectorGroupValue {
  industries: { [key: string]: IndustryGroupValue };
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
}

export class IndustryGroupValue {
  currentValue: number;
  totalCostBasis: number;
  positions: { [key: string]: PositionGroupValue };
  percentGain: number;
}

export class IndustryGroup {
  [key: string]: IndustryGroupValue;
}

export class PositionGroup {
  [key: string]: PositionGroupValue;
}

export class PositionGroupValue {
  companyName: string;
  currentValue: number;
  totalCostBasis: number;
  percentGain: number;
}

export enum GroupType {
  SECTOR,
  INDUSTRY,
  POSITION,
}

export interface GroupValuesFactory {
  createPositionGroupValue: () => PositionGroupValue;
  createIndustryGroupValue: () => IndustryGroupValue;
  createSectorGroupValue: () => SectorGroupValue;
}

export interface GroupValues {
  sectorGroupValue: SectorGroupValue;
  industryGroupValue: IndustryGroupValue;
  positionGroupValue: PositionGroupValue;
}
