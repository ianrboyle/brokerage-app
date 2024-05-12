import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Position } from '@app/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionSqlQueryResult } from './dtos/position-sector-sql-query-result.dto';

@Injectable()
export class PositionsRepository extends AbstractRepository<Position> {
  protected readonly logger = new Logger(PositionsRepository.name);
  CURRENT_VALUE_CALCULATION = '(position."quantity" * c."price")';
  TOTAL_COST_BASIS_CALCULATION =
    '(position."quantity" * position."costPerShare")';

  PERCENT_GAIN_CALCULATION =
    parseFloat(this.TOTAL_COST_BASIS_CALCULATION) === 0 ||
    this.TOTAL_COST_BASIS_CALCULATION === '0'
      ? '1'
      : `((${this.CURRENT_VALUE_CALCULATION} - ${this.TOTAL_COST_BASIS_CALCULATION}) / ${this.TOTAL_COST_BASIS_CALCULATION}) * 100`;
  constructor(
    @InjectRepository(Position)
    positionsRepository: Repository<Position>,
    entityManager: EntityManager,
  ) {
    super(positionsRepository, entityManager);
  }

  async getPositionsBySector(userId: number) {
    const repository = this.entityManager.getRepository(Position);
    return await repository
      .createQueryBuilder('position')
      .innerJoin('industry', 'i', 'position."industryId" = i."id"')
      .innerJoin('sector', 's', 's."id" = i."sectorId"')
      .innerJoin('company_profile', 'c', 'c."symbol" = position."symbol"')
      .addSelect('s."id" AS "sectorId"')
      .addSelect('s."sectorName"')
      .addSelect('i."industryName"')
      .addSelect('position."symbol" AS "symbol"')
      .addSelect('position."quantity" AS "quantity"')
      .addSelect(`${this.CURRENT_VALUE_CALCULATION} AS "currentValue"`)
      // .addSelect(`${this.PERCENT_GAIN_CALCULATION} AS "percentGain"`)
      .addSelect('position.id AS "positionId"')
      .addSelect('i.id AS "industryId"')
      .addSelect('c."companyName" AS "companyName"')
      .addSelect(`${this.TOTAL_COST_BASIS_CALCULATION} AS "totalCostBasis"`)
      .where('"position"."userId" = :userId', { userId: userId })
      .getRawMany();
  }

  async getPositionById(
    positionId: number,
    userId: number,
  ): Promise<PositionSqlQueryResult> {
    const repository = this.entityManager.getRepository(Position);
    console.log('WHY IS THIS GETTING HIT?? ');
    return await repository
      .createQueryBuilder('position')
      .innerJoin('industry', 'i', 'position."industryId" = i."id"')
      .innerJoin('sector', 's', 's."id" = i."sectorId"')
      .innerJoin('company_profile', 'c', 'c."symbol" = position."symbol"')
      .addSelect('s."id" AS "sectorId"')
      .addSelect('s."sectorName"')
      .addSelect('i."industryName"')
      .addSelect('position."symbol" AS "symbol"')
      .addSelect('position."quantity" AS "quantity"')
      .addSelect('position."costPerShare" AS "costPerShare"')
      .addSelect(`${this.CURRENT_VALUE_CALCULATION} AS "currentValue"`)
      // .addSelect(`${this.PERCENT_GAIN_CALCULATION} AS "percentGain"`)
      .addSelect('position.id AS "positionId"')
      .addSelect('i.id AS "industryId"')
      .addSelect('c."companyName" AS "companyName"')
      .addSelect(`${this.TOTAL_COST_BASIS_CALCULATION} AS "totalCostBasis"`)
      .where('"position"."userId" = :userId', { userId: userId })
      .where('"position"."id" = :positionId', { positionId: positionId })
      .getRawOne();
  }
}
