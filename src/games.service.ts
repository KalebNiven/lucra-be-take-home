import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CellStatus, Game, GameCell, GameStatus } from './entities';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,

    @InjectRepository(GameCell)
    private gameCellsRepository: Repository<GameCell>,
  ) {}

  async findAllGames(status?: GameStatus) {
    return this.gamesRepository.find({ where: status ? { status } : {} });
  }

  async findOneGame(id: string) {
    return this.gamesRepository.findOne({
      where: { id },
      relations: ['cells'],
    });
  }

  async saveGame(rows: number, cols: number): Promise<Game> {
    const grid = this.createGameGrid(rows, cols);
    const game = new Game();
    game.status = GameStatus.Pending;
    game.rows = rows;
    game.columns = cols;
    game.cells = [];

    const savedGame = await this.gamesRepository.save(game);
    const gameCells = grid.flat().map((cell) => {
      cell.game = savedGame;
      return cell;
    });

    await this.gameCellsRepository.save(gameCells);

    return savedGame;
  }

  private createGameGrid(rows: number, cols: number): GameCell[][] {
    const grid: GameCell[][] = [];
    const totalCells = rows * cols;
    // 15% of the cells are mines
    const mineCount = Math.floor(totalCells * 0.15);

    // Create the grid with empty cells
    for (let row = 0; row < rows; row++) {
      const rowCells: GameCell[] = [];
      for (let col = 0; col < cols; col++) {
        const cell = new GameCell();
        cell.status = CellStatus.Hidden;
        cell.isMine = false;
        cell.neighboringBombCount = 0;
        cell.xCoordinate = row;
        cell.yCoordinate = col;

        rowCells.push(cell);
      }
      grid.push(rowCells);
    }

    // Randomly place mines in the grid
    let placedMines = 0;
    while (placedMines < mineCount) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomCol = Math.floor(Math.random() * cols);

      if (!grid[randomRow][randomCol].isMine) {
        grid[randomRow][randomCol].isMine = true;
        placedMines++;

        for (let r = -1; r <= 1; r++) {
          for (let c = -1; c <= 1; c++) {
            const newRow = randomRow + r;
            const newCol = randomCol + c;

            if (
              newRow >= 0 &&
              newRow < rows &&
              newCol >= 0 &&
              newCol < cols &&
              !(r === 0 && c === 0)
            ) {
              grid[newRow][newCol].neighboringBombCount++;
            }
          }
        }
      }
    }

    return grid;
  }
}
