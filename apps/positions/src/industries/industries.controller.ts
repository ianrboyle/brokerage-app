import { Controller, Get, Post, Body, Param } from '@nestjs/common';

import { IndustriesService } from './industries.service';
import { CreateIndustryDto } from './dtos/create-industry.dto';
// import { JwtAuthGuard } from '@app/common';

// @UseGuards(JwtAuthGuard)
@Controller('industries')
export class IndustriesController {
  constructor(private readonly industriesService: IndustriesService) {}

  @Post()
  async create(@Body() createIndustryDto: CreateIndustryDto) {
    return await this.industriesService.getOrCreateIndustry(
      createIndustryDto.industryName,
      createIndustryDto.sector,
    );
  }

  @Get()
  async findAll() {
    return await this.industriesService.findAll();
  }
  @Get('sector/:id')
  async getIndustriesBySectorId(@Param('id') id: string) {
    return await this.industriesService.getIndustriesBySectorId(+id);
  }
}
