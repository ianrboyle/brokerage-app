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
}
