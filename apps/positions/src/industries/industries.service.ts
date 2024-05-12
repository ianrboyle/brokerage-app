import { Injectable } from '@nestjs/common';

import { Industry } from './industries.entity';
import { Sector } from '../sectors/sector.entity';
import { IndustriesRepository } from './industries.repository';
import {
  GetIndustryDto,
  GetIndustrySqlResult,
} from './dtos/get-industries.dto';

@Injectable()
export class IndustriesService {
  constructor(private readonly industriesRepository: IndustriesRepository) {}

  create(industryName: string, sector: Sector) {
    const industry = new Industry({
      industryName: industryName,
      sector: sector,
    });
    return this.industriesRepository.create(industry);
  }

  async findOne(id: number) {
    return await this.industriesRepository.findOne({ id });
  }

  async find(industryName: string) {
    const industries = await this.industriesRepository.find({
      industryName,
    });
    return !industries || industries.length <= 0 ? null : industries[0];
  }

  async findAll() {
    return await this.industriesRepository.find({});
  }
  async getIndustriesBySectorId(sectorId: number) {
    const queryResult = await this.industriesRepository.getIndustries(sectorId);
    return this.mapIndustries(queryResult);
  }

  async update(id: number, attrs: Partial<Industry>) {
    return this.industriesRepository.findOneAndUpdate({ id }, attrs);
  }

  async remove(id: number) {
    return this.industriesRepository.findOneAndDelete({ id });
  }

  async getOrCreateIndustry(industryName: string, sector: Sector) {
    const industry = await this.find(industryName);

    if (!industry) {
      return await this.create(industryName, sector);
    }
    return industry;
  }

  private mapIndustries(queryResult: GetIndustrySqlResult[]): GetIndustryDto[] {
    const industries: GetIndustryDto[] = [];
    for (const indSql of queryResult) {
      const ind: GetIndustryDto = {
        industryId: indSql.industryId,
        industryName: indSql.industryName,
        sectorId: indSql.sectorId,
      };
      industries.push(ind);
    }

    return industries;
  }
}
