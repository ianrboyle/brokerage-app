import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioService } from './portfolio.service';
import {
  GroupValuesFactory,
  PortfolioIndustry,
  PortfolioPosition,
  PortfolioSector,
  PortfolioSectors,
} from './dtos/portfolio-dto';
import { PositionSqlQueryResult } from '../positions/dtos/position-sector-sql-query-result.dto';

describe('PortfolioService', () => {
  let service: PortfolioService;
  let mockPosition: PositionSqlQueryResult;
  let mockPortfolioPositionOne: PortfolioPosition;
  let mockPositionSqlQueryResult: PositionSqlQueryResult[];
  let testSectorTotalCostBasis: number;
  let testSectorTotalCurrentValue: number;
  let testSectorTotalPercentGain: number;
  let mockPortfolioSectorOne: PortfolioSector;
  let mockPortfolioIndustryOne: PortfolioIndustry;
  let mockPortfolioSectors: PortfolioSectors;
  let mockUpdatePortfolioIndustry: PortfolioIndustry;
  beforeEach(async () => {
    mockPosition = getMockPosition();
    mockPortfolioPositionOne = getMockPortfolioPosition();
    mockPositionSqlQueryResult = getMockPositionSqlQueryResult();
    testSectorTotalCostBasis = getTestSectorTotalCostBasis();
    testSectorTotalCurrentValue = getTestSectorTotalCurrentValue();
    testSectorTotalPercentGain = getTestSectorTotalPercentGain();
    mockPortfolioSectorOne = getMockPortfolioSector();
    mockPortfolioIndustryOne = getMockPortfolioIndustry();
    mockPortfolioSectors = getUpdatedMockPortfolioSectors();
    mockUpdatePortfolioIndustry = getUpdatedMockPortfolioIndustry();
    const module: TestingModule = await Test.createTestingModule({
      providers: [PortfolioService],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shoudld map portfolio sectors', () => {
    const portfolioSectors = service.mapPortfolioSectors(
      mockPositionSqlQueryResult,
    );
    const sectorOne = portfolioSectors['Test sector'];
    const industryOne = sectorOne.industries['Test industry one'];
    const industryTwo = sectorOne.industries['Test industry two'];
    expect(portfolioSectors).toBeDefined();
    expect(sectorOne).toBeDefined();
    expect(sectorOne.currentValue).toEqual(testSectorTotalCurrentValue);
    expect(sectorOne.totalCostBasis).toEqual(testSectorTotalCostBasis);
    expect(sectorOne.percentGain).toEqual(testSectorTotalPercentGain);

    expect(industryOne).toBeDefined();
    expect(industryOne.currentValue).toBeDefined();
    expect(industryOne.currentValue).toEqual(testIndustryOneTotalCurrentValue);
    expect(industryOne.totalCostBasis).toBeDefined();
    expect(industryOne.totalCostBasis).toEqual(testIndustryOneTotalCostBasis);
    expect(industryOne.percentGain).toEqual(testIndustryOneTotalPercentGain);

    expect(industryTwo).toBeDefined();
    expect(industryTwo.currentValue).toBeDefined();
    expect(industryTwo.currentValue).toEqual(testIndustryTwoTotalCurrentValue);
    expect(industryTwo.totalCostBasis).toBeDefined();
    expect(industryTwo.totalCostBasis).toEqual(testIndustryTwoTotalCostBasis);
    expect(industryTwo.percentGain).toEqual(testIndustryTwoTotalPercentGain);

    for (const sectorName in portfolioSectors) {
      expect(portfolioSectors[sectorName]).toBeDefined();
      expect(portfolioSectors[sectorName].percentGain).toBeDefined();
      expect(portfolioSectors[sectorName].currentValue).toBeDefined();
      expect(portfolioSectors[sectorName].totalCostBasis).toBeDefined();
      expect(portfolioSectors[sectorName].totalCostBasis > 0).toBeTruthy();
      expect(portfolioSectors[sectorName].industries).toBeDefined();
      if (sectorName == 'Banking') {
        expect(portfolioSectors[sectorName].percentGain).toEqual(100);
      }
      const industries = portfolioSectors[sectorName].industries;
      for (const industryName in industries) {
        const industry = industries[industryName];
        expect(industry).toBeDefined();
        expect(industry.percentGain).toBeDefined();
        expect(industry.currentValue).toBeDefined();
        expect(industry.currentValue > 0).toBeTruthy();
        expect(industry.totalCostBasis).toBeDefined();
        expect(industry.totalCostBasis > 0).toBeTruthy();
        expect(industry.positions).toBeDefined();
        const positions = industry.positions;
        for (const pName in positions) {
          const p = positions[pName];
          expect(p).toBeDefined();
          expect(p.percentGain).toBeDefined();
          expect(p.currentValue).toBeDefined();
          expect(p.currentValue > 0).toBeTruthy();
          expect(p.totalCostBasis).toBeDefined();
          expect(p.totalCostBasis > 0).toBeTruthy();
        }
      }
    }
  });

  it('should group values by sector', () => {
    const portfolioSectors: PortfolioSectors = {};
    const groupValuesFactory = createGroupValuesFactory();
    for (const position of mockPositionSqlQueryResult) {
      const { portfolioSector, portfolioIndustry, portfolioPosition } =
        service.createGroupValues(
          portfolioSectors,
          groupValuesFactory,
          position,
        );
      expect(portfolioSector).toBeDefined();
      expect(portfolioIndustry).toBeDefined();
      expect(portfolioPosition).toBeDefined();
    }
    expect(portfolioSectors['Test sector']).toBeDefined();
    expect(portfolioSectors['Test sector'].industries).toBeDefined();
  });

  it('should create a group value', () => {
    const portfolioSectors: PortfolioSectors = {};
    const groupValuesFactory = createGroupValuesFactory();
    const position = mockPositionSqlQueryResult[4];
    service.createGroupValues(portfolioSectors, groupValuesFactory, position);
    expect(portfolioSectors['Test sector']).toBeDefined();
    expect(portfolioSectors['Test sector'].industries).toBeDefined();
    expect(
      portfolioSectors['Test sector'].industries['Test industry two'],
    ).toBeDefined();
    expect(
      portfolioSectors['Test sector'].industries['Test industry two'].positions,
    ).toBeDefined();
    expect(
      portfolioSectors['Test sector'].industries['Test industry two'].positions[
        'TEST2'
      ],
    ).toBeDefined();
  });

  it('should update group values', () => {
    const pS = mockPortfolioSectorOne;
    const pI = mockPortfolioIndustryOne;
    const pP = mockPortfolioPositionOne;
    const mP = mockPosition;
    const portfolioSectors = {};

    service.updateGroupValues(pS, pI, pP, portfolioSectors, mP);

    expect(portfolioSectors[mP.sectorName]).toBeDefined();
    expect(portfolioSectors[mP.sectorName].currentValue).toEqual(
      mP.currentValue,
    );
    expect(portfolioSectors[mP.sectorName].totalCostBasis).toEqual(
      mP.totalCostBasis,
    );
    expect(pS.industries).toBeDefined;
    expect(portfolioSectors[mP.sectorName]).toEqual(pS);
    expect(portfolioSectors[mP.sectorName].industries[mP.industryName]).toEqual(
      pI,
    );
    expect(
      portfolioSectors[mP.sectorName].industries[mP.industryName].positions[
        mP.symbol
      ],
    ).toEqual(pP);
  });

  it('should update a single groups value', () => {
    const pP: PortfolioPosition = mockPortfolioPositionOne;
    const mP = mockPosition;
    const portfolioPosition = service.updateGroupValue(
      pP,
      mP,
    ) as PortfolioPosition;

    expect(portfolioPosition).toBeDefined();
    expect(portfolioPosition.currentValue).toEqual(mP.currentValue);
    expect(portfolioPosition.companyName).toEqual(mP.companyName);
  });

  it('should caluclate all groups percent gains', () => {
    const portfolioSectors = mockPortfolioSectors;
    service.calculateGroupsPercentGain(portfolioSectors);
    for (const sectorName in portfolioSectors) {
      const sector = portfolioSectors[sectorName];
      expect(sector.currentValue > 0).toBeTruthy();
      expect(Math.abs(sector.percentGain) > 0).toBeTruthy();
      expect(sector.industries['TEST'].currentValue > 0).toBeTruthy();
      expect(Math.abs(sector.industries['TEST'].percentGain) > 0).toBeTruthy();
    }
  });
  it('should caluclate a single groups percent gains', () => {
    const portfolioIndustry = mockUpdatePortfolioIndustry;
    service.calculatePercentGain(portfolioIndustry);
    expect(Math.abs(portfolioIndustry.percentGain) > 0).toBeTruthy();
  });

  const getMockPositionSqlQueryResult = (): PositionSqlQueryResult[] => {
    return [
      {
        sectorId: 1,
        sectorName: 'Technology',
        industryName: 'Software',
        symbol: 'AAPL',
        currentValue: 100,
        positionId: 101,
        industryId: 1,
        totalCostBasis: 10,
        companyName: 'Apple Inc.',
        quantity: 10,
        percentGain: 900.0,
      },
      {
        sectorId: 2,
        sectorName: 'Finance',
        industryName: 'Banking',
        symbol: 'JPM',
        currentValue: 10,
        positionId: 102,
        industryId: 3,
        totalCostBasis: 5,
        companyName: 'JPMorgan Chase & Co.',
        quantity: 2,
        percentGain: 100,
      },
      {
        sectorId: 1,
        sectorName: 'Technology',
        industryName: 'Computers',
        symbol: 'MSFT',
        currentValue: 50,
        positionId: 103,
        industryId: 2,
        totalCostBasis: 100,
        companyName: 'Microsoft.',
        quantity: 2,
        percentGain: -50,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry one',
        symbol: 'TEST1',
        currentValue: 10,
        positionId: 104,
        industryId: 101,
        totalCostBasis: 5,
        companyName: 'Test company.',
        quantity: 1,
        percentGain: 100,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry two',
        symbol: 'TEST2',
        currentValue: 10,
        positionId: 105,
        industryId: 102,
        totalCostBasis: 7,
        companyName: 'TEST2.',
        quantity: 2,
        percentGain: 42.86,
      },
      {
        sectorId: 101,
        sectorName: 'Test sector',
        industryName: 'Test industry two',
        symbol: 'TEST3',
        currentValue: 10,
        positionId: 106,
        industryId: 102,
        totalCostBasis: 15,
        companyName: 'TEST3.',
        quantity: 3,
        percentGain: -33.33,
      },
      // Add more dummy data as needed
    ];
  };

  const getTestSectorTotalCostBasis = () => {
    return 27;
  };
  const getTestSectorTotalCurrentValue = () => {
    return 30;
  };

  const getTestSectorTotalPercentGain = () => {
    return (
      ((testSectorTotalCurrentValue - testSectorTotalCostBasis) /
        testSectorTotalCostBasis) *
      100
    );
  };

  const testIndustryOneTotalCostBasis = 5;
  const testIndustryOneTotalCurrentValue = 10;

  const testIndustryOneTotalPercentGain =
    ((testIndustryOneTotalCurrentValue - testIndustryOneTotalCostBasis) /
      testIndustryOneTotalCostBasis) *
    100;
  const testIndustryTwoTotalCostBasis = 15 + 7;
  const testIndustryTwoTotalCurrentValue = 20;

  const testIndustryTwoTotalPercentGain =
    ((testIndustryTwoTotalCurrentValue - testIndustryTwoTotalCostBasis) /
      testIndustryTwoTotalCostBasis) *
    100;

  const createGroupValuesFactory = (): GroupValuesFactory => {
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
      }),
    };
  };

  const getUpdatedMockPortfolioPosition = (): PortfolioPosition => {
    return {
      companyName: 'Test one',
      currentValue: 10,
      totalCostBasis: 7,
      percentGain: 42.86,
      quantity: 2,
    };
  };

  const getMockPortfolioIndustry = (): PortfolioIndustry => {
    return {
      currentValue: 0,
      totalCostBasis: 0,
      positions: {},
      percentGain: 0,
    };
  };

  const getMockPortfolioSector = (): PortfolioSector => {
    return {
      industries: {},
      currentValue: 0,
      totalCostBasis: 0,
      percentGain: 0,
    };
  };

  const getUpdatedMockPortfolioIndustry = (): PortfolioIndustry => {
    return {
      currentValue: 10,
      totalCostBasis: 15,
      positions: { TEST: getUpdatedMockPortfolioPosition() },
      percentGain: 0,
    };
  };

  const getUpdatedMockPortfolioSectors = (): PortfolioSectors => {
    return {
      TEST: {
        industries: { TEST: getUpdatedMockPortfolioIndustry() },
        currentValue: 10,
        totalCostBasis: 15,
        percentGain: 0,
      },
    };
  };

  const getMockPosition = (): PositionSqlQueryResult => {
    return {
      sectorId: 101,
      sectorName: 'Test sector',
      industryName: 'Test industry',
      symbol: 'TEST',
      currentValue: 10,
      positionId: 105,
      industryId: 102,
      totalCostBasis: 7,
      companyName: 'TEST.',
      quantity: 2,
      percentGain: 42.86,
    };
  };

  const getMockPortfolioPosition = (): PortfolioPosition => {
    return {
      companyName: '',
      currentValue: 0,
      totalCostBasis: 0,
      percentGain: 0,
      quantity: 0,
    };
  };
});
