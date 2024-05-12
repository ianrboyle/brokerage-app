import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from './industries.entity';
import { GetIndustrySqlResult } from './dtos/get-industries.dto';

@Injectable()
export class IndustriesRepository extends AbstractRepository<Industry> {
  protected readonly logger = new Logger(IndustriesRepository.name);

  constructor(
    @InjectRepository(Industry)
    industriesRepository: Repository<Industry>,
    entityManager: EntityManager,
  ) {
    super(industriesRepository, entityManager);
  }

  async getIndustries(sectorId: number): Promise<GetIndustrySqlResult[]> {
    const repository = this.entityManager.getRepository(Industry);
    return await repository
      .createQueryBuilder('industry')
      .innerJoin('sector', 's', 's."id" = industry."sectorId"')
      .addSelect('s."id" AS "sectorId"')
      .addSelect('s."sectorName"')
      .addSelect('industry."industryName"')
      .addSelect('industry.id AS "industryId"')
      .where('"industry"."sectorId" = :sectorId', { sectorId: sectorId })
      .getRawMany();
  }
}
