import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position, User } from '@app/common';
import { CompanyProfilesProxy } from './company-profiles.proxy';

@Injectable()
export class PositionsService {
  constructor(
    private readonly positionsRepository: PositionsRepository,
    private readonly companyProfilesProxy: CompanyProfilesProxy,
  ) {}
  async create(createPositionDto: CreatePositionDto, user: User) {
    const profile = await this.companyProfilesProxy.getOrCreateCompanyProfile(
      createPositionDto.symbol,
    );
    const position = new Position({
      ...createPositionDto,
    });
    position.user = user;
    position.companyProfileId = profile.id;
    position.industryId = 1;
    return await this.positionsRepository.create(position);
  }

  findAll() {
    return this.positionsRepository.find({});
  }

  findOne(id: number) {
    return this.positionsRepository.findOne({ id });
  }

  update(id: number, updatePositionDto: UpdatePositionDto) {
    return this.positionsRepository.findOneAndUpdate({ id }, updatePositionDto);
  }

  remove(id: number) {
    return this.positionsRepository.findOneAndDelete({ id });
  }
}
