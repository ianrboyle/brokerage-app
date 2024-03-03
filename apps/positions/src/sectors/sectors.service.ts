import { Injectable } from '@nestjs/common';

import { Sector } from './sector.entity';
import { SectorsRepository } from './sectors.repository';

@Injectable()
export class SectorsService {
  constructor(private readonly sectorsRepository: SectorsRepository) {}

  create(sectorName: string) {
    const sector = new Sector({ sectorName: sectorName });
    return this.sectorsRepository.create(sector);
  }

  async findOne(id: number) {
    return await this.sectorsRepository.findOne({ id });
  }

  async find(sectorName: string) {
    const sectors = await this.sectorsRepository.find({ sectorName });

    return !sectors || sectors.length <= 0 ? null : sectors[0];
  }

  async getOrCreateSector(sectorName: string) {
    const sector = await this.find(sectorName);

    if (!sector) {
      return await this.create(sectorName);
    }
    return sector;
  }

  async update(id: number, attrs: Partial<Sector>) {
    return this.sectorsRepository.findOneAndUpdate({ id }, attrs);
  }

  async remove(id: number) {
    return this.sectorsRepository.findOneAndDelete({ id });
  }
}
