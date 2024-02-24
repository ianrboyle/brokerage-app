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
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { CurrentUser, JwtAuthGuard } from '@app/common';
import { User } from '@app/common';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createPositionDto: CreatePositionDto,
    @CurrentUser() user: User,
  ) {
    const userId = user.id;
    return await this.positionsService.create(createPositionDto, userId);
  }

  @Get()
  async findAll() {
    return this.positionsService.findAll();
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
