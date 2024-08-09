import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { GameStatus } from './entities';

@Controller('games')
export class GamesController {
  constructor(private readonly appService: GamesService) {}

  @Get()
  async getAll(@Query('status') status?: GameStatus) {
    const games = await this.appService.findAllGames(status);
    return games || [];
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const game = await this.appService.findOneGame(id);

    if (!game) {
      throw new NotFoundException(`Game with id "${id}" not found`);
    }

    return game;
  }

  @Post()
  async create(@Body('rows') rows: number, @Body('cols') cols: number) {
    if (rows <= 0 || cols <= 0) {
      throw new Error('Rows and columns must be greater than zero.');
    }
    const created = await this.appService.saveGame(rows, cols);
    const game = await this.appService.findOneGame(created.id);
    return game;
  }
}
