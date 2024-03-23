import { Controller, Get, Post, Body } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dtos/create-sector.dto';
import { SectorDto } from './dtos/sector.dto';
import { Serialize } from '@app/common';

@Controller('sectors')
@Serialize(SectorDto)
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  async create(@Body() createSectorDto: CreateSectorDto) {
    return await this.sectorsService.create(createSectorDto.sectorName);
  }

  @Get()
  async findAll() {
    const sectors = await this.sectorsService.findAll();
    return sectors;
  }
}
