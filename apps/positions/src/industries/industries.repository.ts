import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';

import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Industry } from './industries.entity';

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
}
