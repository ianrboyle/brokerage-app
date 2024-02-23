import { Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { PositionsRepository } from './positions.repository';
import { Position } from './entities/position.entity';

@Injectable()
export class PositionsService {
  constructor(private readonly positionsRepository: PositionsRepository) {}
  create(createPositionDto: CreatePositionDto) {
    const position = new Position({
      ...createPositionDto,
    });
    position.userId = 1;
    position.companyProfileId = 1;
    position.industryId = 1;
    return this.positionsRepository.create(position);
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
