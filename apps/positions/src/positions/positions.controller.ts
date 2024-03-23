import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PositionsService } from './positions.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { UpdatePositionDto } from './dtos/update-position.dto';
import { CurrentUser, JwtAuthGuard, Position, User } from '@app/common';
import { UpdatePositionIndustryDto } from './dtos/update-position-industry.dto';

@UseGuards(JwtAuthGuard)
@Controller('positions')
// @Serialize(PositionDto)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
    @CurrentUser() user: User,
  ) {
    return await this.positionsService.create(createPositionDto, user);
  }

  @Get()
  async getUserPositions(@CurrentUser() user: User) {
    const positions: Position[] = await this.positionsService.getUserPositions(
      user.id,
    );
    return positions;
  }
  @Get('/sectors')
  async getPositionsBySector(@CurrentUser() user: User) {
    const positions = await this.positionsService.getPositionPortfolioSectors(
      user.id,
    );
    return positions;
  }
  @Post('/insertmultiple')
  createPositions(
    @Body() body: CreatePositionDto[],
    @CurrentUser() user: User,
  ) {
    const positions = this.positionsService.insertMultiple(body, user);
    return positions;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.positionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(+id, updatePositionDto);
  }

  @Patch(':id')
  updatePositionSector(
    @Param('id') id: string,
    @Body() updatePositionIndustryDto: UpdatePositionIndustryDto,
  ) {
    return this.positionsService.updatePositionIndustry(
      +id,
      updatePositionIndustryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
