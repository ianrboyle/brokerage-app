import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dtos/create-sector.dto';
import { SectorDto } from './dtos/sector.dto';
import { JwtAuthGuard, Serialize } from '@app/common';

@UseGuards(JwtAuthGuard)
@Controller('sectors')
@Serialize(SectorDto)
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}

  @Post()
  async create(@Body() createSectorDto: CreateSectorDto) {
    return await this.sectorsService.getOrCreateSector(
      createSectorDto.sectorName,
    );
  }

  @Get()
  async findAll() {
    const sectors = await this.sectorsService.findAll();
    return sectors;
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sectorsService.remove(+id);
  }
}
