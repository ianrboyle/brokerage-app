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
import { CreatePositionDto } from '../dto/create-position.dto';
import { UpdatePositionDto } from '../dto/update-position.dto';
import { CurrentUser, JwtAuthGuard, Position, User } from '@app/common';
import { PositionDto } from '../dto/position-dto';
import { Serialize } from '@app/common';

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
    const positions = await this.positionsService.getPositionsBySector(user.id);
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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.positionsService.remove(+id);
  }
}
