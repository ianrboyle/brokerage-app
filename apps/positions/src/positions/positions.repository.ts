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
}
