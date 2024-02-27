import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, Position } from '@app/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionsRepository extends AbstractRepository<Position> {
  protected readonly logger = new Logger(PositionsRepository.name);

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
      .addSelect('(position."quantity" * c."price") AS "currentValue"')
      .addSelect('position.id AS "positionId"')
      .addSelect('i.id AS "industryId"')
      .addSelect('c."companyName" AS "companyName"')
      .addSelect(
        '(position."quantity" * position."costPerShare") AS "totalCostBasis"',
      )
      .where('"position"."userId" = :userId', { userId: userId })
      .getRawMany();
  }

  async getSomePositions(userId: number) {
    const repository = this.entityManager.getRepository(Position);
    return await repository
      .createQueryBuilder('position')
      .innerJoin('industry', 'i', 'position."industryId" = i.id')
      .where('"position"."userId" = :userId', { userId: userId })
      .getRawMany();
  }
}
