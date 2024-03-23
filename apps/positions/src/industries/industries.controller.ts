import { Controller, Get, Post, Body } from '@nestjs/common';

import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dtos/create-industry.dto';

@Controller('industries')
// @Serialize(IndustryDto)
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post()
  async create(@Body() createIndustryDto: CreateIndustryDto) {
    return await this.industriesService.create(
      createIndustryDto.industryName,
      createIndustryDto.sector,
    );
  }

  @Get()
  async findAll() {
    return await this.industriesService.findAll();
  }
}
