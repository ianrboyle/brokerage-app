import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './sector.entity';

@Injectable()
export class SectorsRepository extends AbstractRepository<Sector> {
  protected readonly logger = new Logger(SectorsRepository.name);

  constructor(
    @InjectRepository(Sector)
    sectorsRepository: Repository<Sector>,
    entityManager: EntityManager,
  ) {
    super(sectorsRepository, entityManager);
  }

  async getPositionQueryResult(userId: number) {
    const repository = this.entityManager.getRepository(Sector);
    return await repository
      .createQueryBuilder('sector')
      .innerJoin('industry', 'i', '"i"."sectorId" = "sector"."id"')
      .innerJoin('position', 'p', '"p"."industryId" = "i"."id"')
      .innerJoin('company_profile', 'c', 'c."symbol" = "p"."symbol"')
      .addSelect('"sector"."id" AS "sectorId"')
      .addSelect('"sector"."sectorName" AS "sectorName"')
      .addSelect('"i"."industryName"')
      .addSelect('"p"."symbol"')
      .addSelect('(p."quantity" * c."price") AS "currentValue"')
      .addSelect('p.id AS "positionId"')
      .addSelect('i.id AS "industryId"')
      .addSelect('c."companyName" AS "companyName"')
      .addSelect('(p."quantity" * p."costPerShare") AS "totalCostBasis"')
      .where('"p"."userId" = :userId', { userId: userId })
      .getRawMany();
  }
}
