import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository, CompanyProfile } from '@app/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyProfilesRepository extends AbstractRepository<CompanyProfile> {
  protected readonly logger = new Logger(CompanyProfilesRepository.name);

  constructor(
    @InjectRepository(CompanyProfile)
    companyProfilesRepository: Repository<CompanyProfile>,
    entityManager: EntityManager,
  ) {
    super(companyProfilesRepository, entityManager);
  }
}
