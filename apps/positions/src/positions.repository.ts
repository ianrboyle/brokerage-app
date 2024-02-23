import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { Position } from './entities/position.entity';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PositionsRepository extends AbstractRepository<Position> {
  protected readonly logger = new Logger(PositionsRepository.name);

  constructor(
    @InjectRepository(Position)
    positionRepository: Repository<Position>,
    entityManager: EntityManager,
  ) {
    super(positionRepository, entityManager);
  }
}
